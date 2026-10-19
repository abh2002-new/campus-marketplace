import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EmptyState } from "./components/EmptyState";
import { ExplorePage } from "./pages/ExplorePage";
import { MessagesPage } from "./pages/MessagesPage";
import { MyListingsPage } from "./pages/MyListingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SavedPage } from "./pages/SavedPage";
import { categories, seedListings, universities } from "./data";
import { auth, db, firebaseConfigured, storage } from "./firebase";
import { ItemRequestsModal } from "./features/ItemRequestsModal";
import { MakeOfferView } from "./features/MakeOfferModal";
import { MeetupSchedulerView } from "./features/MeetupSchedulerModal";
import { SellerReviewsView } from "./features/SellerReviewsModal";
import { ReportListingView } from "./features/ReportListingModal";
import {
  Conversation,
  ItemRequest,
  Listing,
  ListingReport,
  MeetupPlan,
  Message,
  Offer,
  Tab,
} from "./types";

async function registerUser(user: User) {
  if (!db) return;
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      displayName:
        user.displayName || user.email?.split("@")[0] || "Campus student",
      email: user.email || "",
      photoURL: user.photoURL || null,
      campus: universities[0],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function App() {
  const [tab, setTab] = useState<Tab>("Explore");
  const [items, setItems] = useState(seedListings);
  const [queryText, setQueryText] = useState("");
  const [category, setCategory] = useState("All items");
  const [campus, setCampus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [user, setUser] = useState<User | null>(auth?.currentUser || null);
  const [authOpen, setAuthOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [authError, setAuthError] = useState("");
  const [profileReady, setProfileReady] = useState(false);

  // Member 1 Request Board State
  const [requestsOpen, setRequestsOpen] = useState(false);

  useEffect(() => {
    const firebaseAuth = auth;
    if (!firebaseAuth) return;
    const handleUser = (nextUser: User | null) => {
      setUser(nextUser);
      if (nextUser)
        registerUser(nextUser)
          .then(() => setProfileReady(true))
          .catch((error) =>
            setAuthError(
              error instanceof Error
                ? error.message
                : "Could not create profile.",
            ),
          );
      else setProfileReady(false);
    };
    let unsubscribe: () => void = () => undefined;
    (Platform.OS === "web"
      ? setPersistence(firebaseAuth, browserLocalPersistence)
      : Promise.resolve())
      .then(() => {
        unsubscribe = onAuthStateChanged(firebaseAuth, handleUser);
        return Platform.OS === "web" ? getRedirectResult(firebaseAuth) : null;
      })
      .then((result) => {
        if (result?.user) handleUser(result.user);
      })
      .catch((error) =>
        setAuthError(
          error instanceof Error
            ? error.message
            : "Google sign-in could not be completed.",
        ),
      );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) return;
    const listingsQuery = query(collection(db, "listings"));
    return onSnapshot(
      listingsQuery,
      (snapshot) =>
        setItems(
          snapshot.empty
            ? seedListings
            : snapshot.docs.map(
                (entry) => ({ id: entry.id, ...entry.data() }) as Listing,
              ),
        ),
      () => setItems(seedListings),
    );
  }, []);

  useEffect(() => {
    if (!db || !user) {
      setSavedIds([]);
      setConversations([]);
      return;
    }
    const savedQuery = collection(db, "users", user.uid, "saved");
    const unsubscribeSaved = onSnapshot(savedQuery, (snapshot) =>
      setSavedIds(snapshot.docs.map((entry) => entry.id)),
    );
    const conversationsQuery = query(
      collection(db, "conversations"),
      where("memberIds", "array-contains", user.uid),
    );
    const unsubscribeConversations = onSnapshot(
      conversationsQuery,
      (snapshot) =>
        setConversations(
          snapshot.docs
            .map((entry) => ({ id: entry.id, ...entry.data() }) as Conversation)
            .sort(
              (first, second) =>
                (second.updatedAt?.seconds || 0) -
                (first.updatedAt?.seconds || 0),
            ),
        ),
      () => setConversations([]),
    );
    return () => {
      unsubscribeSaved();
      unsubscribeConversations();
    };
  }, [user]);

  const filteredItems = useMemo(
    () => {
      const parsedMinPrice = Number(minPrice);
      const parsedMaxPrice = Number(maxPrice);
      const hasMinPrice = minPrice !== "" && Number.isFinite(parsedMinPrice);
      const hasMaxPrice = maxPrice !== "" && Number.isFinite(parsedMaxPrice);

      return items.filter(
        (item) =>
          (category === "All items" || item.category === category) &&
          campus !== "" &&
          item.university === campus &&
          item.title.toLowerCase().includes(queryText.toLowerCase()) &&
          (!hasMinPrice || item.price >= parsedMinPrice) &&
          (!hasMaxPrice || item.price <= parsedMaxPrice),
      );
    },
    [campus, category, items, maxPrice, minPrice, queryText],
  );
  const campuses = universities;
  const myListings = useMemo(
    () => (user ? items.filter((item) => item.sellerId === user.uid) : []),
    [items, user],
  );
  const toggleSaved = async (id: string) => {
    const nextSaved = savedIds.includes(id)
      ? savedIds.filter((value) => value !== id)
      : [...savedIds, id];
    setSavedIds(nextSaved);
    if (!db || !user) return;
    const savedDocument = doc(db, "users", user.uid, "saved", id);
    try {
      if (nextSaved.includes(id)) {
        await setDoc(savedDocument, { listingId: id });
      } else {
        await deleteDoc(savedDocument);
      }
    } catch (error) {
      setSavedIds(savedIds);
      Alert.alert("Could not update saved items", errorMessage(error, "Please try again."));
    }
  };
  const signInWithGoogle = async () => {
    if (!auth) return;
    setAuthError("");
    try {
      if (Platform.OS === "web") {
        await setPersistence(auth, browserLocalPersistence);
      }
      if (Platform.OS === "web") {
        const result = await signInWithPopup(auth, new GoogleAuthProvider());
        setUser(result.user);
        setProfileReady(true);
        setAuthOpen(false);
        registerUser(result.user).catch((error) =>
          setAuthError(
            errorMessage(error, "Signed in, but the profile could not be saved."),
          ),
        );
      } else {
        await signInAnonymously(auth);
        setAuthOpen(false);
      }
    } catch (error) {
      const code =
        error instanceof Error ? error.message : "Google sign-in failed.";
      if (
        Platform.OS === "web" &&
        /popup|cancelled-popup-request/i.test(code)
      ) {
        await signInWithRedirect(auth, new GoogleAuthProvider());
        return;
      }
      setAuthError(code);
      Alert.alert("Google sign-in failed", code);
    }
  };
  const signInWithEmail = async (
    email: string,
    password: string,
    createAccount: boolean,
  ) => {
    if (!auth) return;
    setAuthError("");
    try {
      const result = createAccount
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      setProfileReady(true);
      setAuthOpen(false);
      registerUser(result.user).catch((error) =>
        setAuthError(
          errorMessage(error, "Signed in, but the profile could not be saved."),
        ),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not sign in.";
      setAuthError(message);
      Alert.alert("Authentication failed", message);
    }
  };
  const publish = async (
    title: string,
    price: string,
    listingCategory: string,
    university: string,
    imageUri: string | null,
    listingId?: string,
  ) => {
    if (!user) {
      setSellOpen(false);
      setAuthOpen(true);
      return;
    }
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      Alert.alert("Invalid price", "Enter a valid LKR price.");
      return;
    }
    try {
      let image = listingId && editingListing?.image
        ? editingListing.image
        : seedListings[0].image;
      if (imageUri) {
        if (!storage) {
          Alert.alert("Photo upload unavailable", "Connect Firebase Storage first.");
          return;
        }
        const imageResponse = await fetch(imageUri);
        const imageBlob = await imageResponse.blob();
        const imageRef = ref(storage, `listing-images/${user.uid}/${Date.now()}`);
        await uploadBytes(imageRef, imageBlob, {
          contentType: imageBlob.type || "image/jpeg",
        });
        image = await getDownloadURL(imageRef);
      }
      const listingData = {
        title,
        price: numericPrice,
        category: listingCategory,
        university,
        seller: user.displayName || user.email || "You",
        sellerId: user.uid,
        campus: university,
        condition: "Good condition",
        image,
        description: "New listing from a campus seller.",
      };
      if (listingId) {
        await updateDoc(doc(db!, "listings", listingId), listingData);
      } else {
        await addDoc(collection(db!, "listings"), {
          ...listingData,
          createdAt: serverTimestamp(),
        });
      }
      setSellOpen(false);
      setEditingListing(null);
    } catch (error) {
      Alert.alert(
        listingId ? "Could not update listing" : "Could not publish listing",
        errorMessage(error, "Please try again."),
      );
    }
  };
  const deleteListing = (item: Listing) => {
    const firestoreDb = db;
    if (!firestoreDb || !user || item.sellerId !== user.uid) return;
    Alert.alert("Delete listing?", `Remove ${item.title}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(firestoreDb, "listings", item.id));
          } catch (error) {
            Alert.alert("Could not delete listing", errorMessage(error, "Please try again."));
          }
        },
      },
    ]);
  };
  const contactSeller = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (!db || !selected?.sellerId || selected.sellerId === user.uid) {
      Alert.alert(
        "Messaging unavailable",
        "This demo listing is not connected to a Firebase seller account yet.",
      );
      return;
    }
    const existingQuery = query(
      collection(db, "conversations"),
      where("memberIds", "array-contains", user.uid),
    );
    const existing = await getDocs(existingQuery);
    const existingConversation = existing.docs.find((entry) => {
      const data = entry.data();
      return (
        data.listingId === selected.id &&
        data.memberIds?.includes(selected.sellerId)
      );
    });
    let conversation: Conversation;
    if (!existingConversation) {
      const created = await addDoc(collection(db, "conversations"), {
        listingId: selected.id,
        listingTitle: selected.title,
        sellerId: selected.sellerId,
        sellerName: selected.seller,
        memberIds: [user.uid, selected.sellerId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      conversation = {
        id: created.id,
        listingId: selected.id,
        listingTitle: selected.title,
        sellerId: selected.sellerId,
        sellerName: selected.seller,
        memberIds: [user.uid, selected.sellerId],
      };
    } else {
      conversation = {
        id: existingConversation.id,
        ...existingConversation.data(),
      } as Conversation;
    }
    setSelected(null);
    setActiveConversation(conversation);
  };
  const sendMessage = async (conversationId: string, text: string) => {
    if (!db || !user || !text.trim()) return;
    await addDoc(collection(db, "conversations", conversationId, "messages"), {
      senderId: user.uid,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, "conversations", conversationId), {
      lastMessage: text.trim(),
      updatedAt: serverTimestamp(),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {tab === "Explore" && (
        <ExplorePage
          items={filteredItems}
          query={queryText}
          category={category}
          campus={campus}
          minPrice={minPrice}
          maxPrice={maxPrice}
          campuses={campuses}
          savedIds={savedIds}
          onQueryChange={setQueryText}
          onCategoryChange={setCategory}
          onCampusChange={setCampus}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onSave={toggleSaved}
          onOpen={setSelected}
          onProfile={() => setTab("Profile")}
          avatarUrl={user?.photoURL}
          onRequestBoard={() => setRequestsOpen(true)}
        />
      )}
      {tab === "Saved" && (
        <SavedPage
          items={items.filter((item) => savedIds.includes(item.id))}
          onSave={toggleSaved}
          onOpen={setSelected}
        />
      )}
      {tab === "Messages" && (
        <MessagesPage
          conversations={conversations}
          onBrowse={() => setTab("Explore")}
          onOpen={(conversation) => setActiveConversation(conversation)}
        />
      )}
      {tab === "MyListings" && (
        <MyListingsPage
          items={myListings}
          onOpen={setSelected}
          onSell={() => {
            setEditingListing(null);
            setSellOpen(true);
          }}
          onEdit={(item) => {
            setEditingListing(item);
            setSellOpen(true);
          }}
          onDelete={deleteListing}
        />
      )}
      {tab === "Profile" && (
        <ProfilePage
          user={user}
          savedCount={savedIds.length}
          listingCount={myListings.length}
          firebaseConfigured={firebaseConfigured}
          profileReady={profileReady}
          error={authError}
          onMyListings={() => (user ? setTab("MyListings") : setAuthOpen(true))}
          onSaved={() => setTab("Saved")}
          onSignIn={() => setAuthOpen(true)}
          onSignOut={() => auth && signOut(auth)}
          onBack={() => setTab("Explore")}
        />
      )}
      <BottomNav
        tab={tab}
        savedCount={savedIds.length}
        onChange={setTab}
        onSell={() => {
          setEditingListing(null);
          setSellOpen(true);
        }}
      />
      <ListingModal
        item={selected}
        user={user}
        onClose={() => setSelected(null)}
        onContact={contactSeller}
        onSendOffer={(offer) => {
          if (selected?.sellerId && user) {
            sendMessage(
              selected.id,
              `[OFFER] Proposed price: LKR ${offer.offerPrice} (Asking: LKR ${offer.originalPrice}). Note: ${offer.note || "No note"}`
            ).catch(() => undefined);
          }
        }}
        onConfirmMeetup={(plan) => {
          if (selected?.sellerId && user) {
            sendMessage(
              selected.id,
              `[SAFE MEETUP PROPOSAL] Location: ${plan.location} | Date: ${plan.date} (${plan.timeSlot})`
            ).catch(() => undefined);
          }
        }}
        onSubmitReport={async (report) => {
          if (db && user) {
            try {
              await addDoc(collection(db, "listingReports"), {
                ...report,
                reporterId: user.uid,
                createdAt: serverTimestamp(),
              });
              Alert.alert(
                "Report Submitted",
                "Thank you for helping keep the campus marketplace safe. Moderators will review this listing."
              );
            } catch (err) {
              console.error("Report submit error:", err);
            }
          }
        }}
      />
      <ItemRequestsModal
        visible={requestsOpen}
        onClose={() => setRequestsOpen(false)}
        currentCampus={campus || universities[0]}
        currentUserName={user?.displayName || user?.email?.split("@")[0]}
        onContactRequester={(req) => {
          setRequestsOpen(false);
          Alert.alert(
            "Contact Requester",
            `Would you like to message ${req.requesterName} regarding their request for "${req.title}"?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Message Student",
                onPress: () => {
                  if (!user) {
                    setAuthOpen(true);
                  } else {
                    setTab("Messages");
                  }
                },
              },
            ]
          );
        }}
      />
      <AuthModal
        visible={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={signInWithGoogle}
        onEmailAuth={signInWithEmail}
        error={authError}
      />
      <SellModal
        visible={sellOpen}
        item={editingListing}
        onClose={() => setSellOpen(false)}
        onSubmit={(title, price, category, university, imageUri) =>
          publish(title, price, category, university, imageUri, editingListing?.id)
        }
      />
      <ChatModal
        conversation={activeConversation}
        user={user}
        onClose={() => setActiveConversation(null)}
        onSend={sendMessage}
      />
    </SafeAreaView>
  );
}

function BottomNav({
  tab,
  savedCount,
  onChange,
  onSell,
}: {
  tab: Tab;
  savedCount: number;
  onChange: (tab: Tab) => void;
  onSell: () => void;
}) {
  return (
    <View style={styles.nav}>
      <NavItem
        label="Explore"
        icon="⌂"
        active={tab === "Explore"}
        onPress={() => onChange("Explore")}
      />
      <NavItem
        label="Saved"
        icon="♡"
        active={tab === "Saved"}
        badge={savedCount}
        onPress={() => onChange("Saved")}
      />
      <NavItem
        label="Messages"
        icon="□"
        active={tab === "Messages"}
        onPress={() => onChange("Messages")}
      />
      <Pressable style={styles.sellButton} onPress={onSell}>
        <Text style={styles.sellPlus}>＋</Text>
        <Text style={styles.sellText}>Sell</Text>
      </Pressable>
    </View>
  );
}
function NavItem({
  label,
  icon,
  active,
  badge,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  badge?: number;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <View style={[styles.navIconWrap, active && styles.navIconWrapActive]}>
        <Text style={[styles.navIcon, active && styles.navActive]}>{icon}</Text>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.navLabel, active && styles.navActive]}>{label}</Text>
    </Pressable>
  );
}
type ListingModalView = "details" | "offer" | "meetup" | "reviews" | "report";

function ListingModal({
  item,
  user,
  onClose,
  onContact,
  onSendOffer,
  onConfirmMeetup,
  onSubmitReport,
}: {
  item: Listing | null;
  user: User | null;
  onClose: () => void;
  onContact: () => void;
  onSendOffer: (offer: Offer) => void;
  onConfirmMeetup: (plan: MeetupPlan) => void;
  onSubmitReport: (report: ListingReport) => void;
}) {
  const [activeView, setActiveView] = useState<ListingModalView>("details");

  useEffect(() => {
    setActiveView("details");
  }, [item]);

  if (!item) return null;

  const handleClose = () => {
    setActiveView("details");
    onClose();
  };

  return (
    <Modal
      visible={item !== null}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={handleClose} />
        {activeView === "reviews" ? (
          <SellerReviewsView
            sellerName={item.seller}
            sellerId={item.sellerId}
            campus={item.campus || item.university}
            currentUserName={user?.displayName || user?.email?.split("@")[0]}
            onBack={() => setActiveView("details")}
            onClose={handleClose}
          />
        ) : activeView === "offer" ? (
          <MakeOfferView
            listing={item}
            currentUserName={user?.displayName || user?.email?.split("@")[0]}
            onBack={() => setActiveView("details")}
            onClose={handleClose}
            onSubmitOffer={(offer) => {
              onSendOffer(offer);
              setActiveView("details");
            }}
          />
        ) : activeView === "meetup" ? (
          <MeetupSchedulerView
            listing={item}
            onBack={() => setActiveView("details")}
            onClose={handleClose}
            onConfirmMeetup={(plan) => {
              onConfirmMeetup(plan);
              setActiveView("details");
            }}
          />
        ) : activeView === "report" ? (
          <ReportListingView
            listing={item}
            onBack={() => setActiveView("details")}
            onClose={handleClose}
            onSubmitReport={(report) => {
              onSubmitReport(report);
              setActiveView("details");
            }}
          />
        ) : (
          <View style={styles.detail}>
            <Image source={{ uri: item.image }} style={styles.detailImage} />
            <Pressable style={styles.close} onPress={handleClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.detailBody}
            >
              <Text style={styles.detailCategory}>
                {item.category.toUpperCase()}
              </Text>
              <Text style={styles.detailTitle}>{item.title}</Text>
              <Text style={styles.detailPrice}>LKR {item.price}</Text>
              <Text style={styles.muted}>
                {item.condition} · {item.university || item.campus} · {item.seller}
              </Text>
              <Text style={styles.description}>{item.description}</Text>
              <Pressable style={styles.primary} onPress={onContact}>
                <Text style={styles.primaryText}>
                  {user
                    ? `Message ${item.seller}`
                    : "Sign in to contact seller"}
                </Text>
              </Pressable>
              <View style={styles.featureActionsRow}>
                <Pressable
                  style={styles.featureActionBtn}
                  onPress={() => setActiveView("offer")}
                >
                  <Text style={styles.featureActionBtnText}>🤝 Make Offer</Text>
                </Pressable>
                <Pressable
                  style={styles.featureActionBtn}
                  onPress={() => setActiveView("meetup")}
                >
                  <Text style={styles.featureActionBtnText}>📍 Safe Meetup</Text>
                </Pressable>
                <Pressable
                  style={styles.featureActionBtn}
                  onPress={() => setActiveView("reviews")}
                >
                  <Text style={styles.featureActionBtnText}>⭐ Reviews</Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.reportListingBtn}
                onPress={() => setActiveView("report")}
              >
                <Text style={styles.reportListingText}>
                  🚨 Report suspicious listing
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </View>
    </Modal>
  );
}
function AuthModal({
  visible,
  onClose,
  onSignIn,
  onEmailAuth,
  error,
}: {
  visible: boolean;
  onClose: () => void;
  onSignIn: () => Promise<void>;
  onEmailAuth: (
    email: string,
    password: string,
    createAccount: boolean,
  ) => Promise<void>;
  error: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(false);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.auth}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {createAccount ? "Create your account" : "Welcome back"}
            </Text>
          </View>
          <Text style={styles.authMessage}>
            Sign in to save listings, message sellers, and publish your own items.
          </Text>
          {error ? <Text style={styles.authError}>{error}</Text> : null}
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="University email"
            style={[styles.field, styles.authField]}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            style={styles.field}
          />
          <Pressable
            disabled={!email || password.length < 6}
            style={[styles.primary, (!email || password.length < 6) && styles.disabled]}
            onPress={() => onEmailAuth(email.trim(), password, createAccount)}
          >
            <Text style={styles.primaryText}>
              {createAccount ? "Create account" : "Sign in"}
            </Text>
          </Pressable>
          <Pressable onPress={() => setCreateAccount((current) => !current)}>
            <Text style={styles.switchAuth}>
              {createAccount
                ? "Already have an account? Sign in"
                : "New here? Create an account"}
            </Text>
          </Pressable>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          <Pressable style={styles.googleButton} onPress={onSignIn}>
            <Text style={styles.googleMark}>G</Text>
            <Text style={styles.outlineText}>Continue with Google</Text>
          </Pressable>
          <Pressable style={styles.outline} onPress={onClose}>
            <Text style={styles.outlineText}>Maybe later</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
function SellModal({
  visible,
  item,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  item: Listing | null;
  onClose: () => void;
  onSubmit: (
    title: string,
    price: string,
    category: string,
    university: string,
    imageUri: string | null,
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [university, setUniversity] = useState(universities[0]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setTitle(item?.title || "");
    setPrice(item ? String(item.price) : "");
    setCategory(item?.category || "Textbooks");
    setUniversity(item?.university || universities[0]);
    setImageUri(null);
    setPreviewUri(item?.image || null);
  }, [item, visible]);

  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPreviewUri(result.assets[0].uri);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.form}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {item ? "Edit listing" : "Sell an item"}
            </Text>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>What are you selling?</Text>
          <Pressable style={styles.photoPicker} onPress={chooseImage}>
            {previewUri ? (
              <Image source={{ uri: previewUri }} style={styles.photoPreview} />
            ) : (
              <Text style={styles.photoPickerText}>＋ Add a photo</Text>
            )}
          </Pressable>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Organic Chemistry textbook"
            style={styles.field}
          />
          <Text style={styles.label}>Price</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="LKR 0"
            style={styles.field}
          />
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.formChips}
          >
            {categories
              .filter((value) => value !== "All items")
              .map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setCategory(value)}
                  style={[styles.formChip, category === value && styles.formChipActive]}
                >
                  <Text
                    style={[
                      styles.formChipText,
                      category === value && styles.formChipTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </Pressable>
              ))}
          </ScrollView>
          <Text style={styles.label}>University</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.formChips}
          >
            {universities.map((value) => (
              <Pressable
                key={value}
                onPress={() => setUniversity(value)}
                style={[styles.formChip, university === value && styles.formChipActive]}
              >
                <Text
                  style={[
                    styles.formChipText,
                    university === value && styles.formChipTextActive,
                  ]}
                >
                  {value}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            disabled={!title || !price}
            style={[styles.primary, (!title || !price) && styles.disabled]}
            onPress={() => onSubmit(title, price, category, university, imageUri)}
          >
            <Text style={styles.primaryText}>
              {item ? "Save changes" : "Publish listing"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ChatModal({
  conversation,
  user,
  onClose,
  onSend,
}: {
  conversation: Conversation | null;
  user: User | null;
  onClose: () => void;
  onSend: (conversationId: string, text: string) => Promise<void>;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!db || !conversation) {
      setMessages([]);
      return;
    }
    const messagesQuery = query(
      collection(db, "conversations", conversation.id, "messages"),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(messagesQuery, (snapshot) =>
      setMessages(
        snapshot.docs.map(
          (entry) => ({ id: entry.id, ...entry.data() }) as Message,
        ),
      ),
    );
  }, [conversation]);

  const submit = async () => {
    if (!conversation || !text.trim()) return;
    await onSend(conversation.id, text);
    setText("");
  };

  return (
    <Modal
      visible={conversation !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.chat}>
          <View style={styles.formHeader}>
            <View>
              <Text style={styles.formTitle}>{conversation?.sellerName}</Text>
              <Text style={styles.chatSubtitle} numberOfLines={1}>
                {conversation?.listingTitle}
              </Text>
            </View>
            <Pressable onPress={onClose}>
              <Text style={styles.closeText}>×</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.messages}>
            {messages.length === 0 ? (
              <Text style={styles.chatEmpty}>
                Start a conversation about this item.
              </Text>
            ) : (
              messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.senderId === user?.uid && styles.myMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.senderId === user?.uid && styles.myMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
          <View style={styles.messageComposer}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Write a message..."
              style={styles.messageInput}
              onSubmitEditing={submit}
            />
            <Pressable
              disabled={!text.trim()}
              style={[styles.sendButton, !text.trim() && styles.disabled]}
              onPress={submit}
            >
              <Text style={styles.sendText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F4" },
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 82,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EBE5",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: { alignItems: "center", minWidth: 54 },
  navIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconWrapActive: { backgroundColor: "#E6F0E6" },
  navIcon: { color: "#83918A", fontSize: 22 },
  navLabel: { color: "#83918A", fontSize: 10, marginTop: 3 },
  navActive: { color: "#1D6B54" },
  badge: {
    position: "absolute",
    right: -12,
    top: -3,
    backgroundColor: "#C3535B",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
  },
  badgeText: { color: "#FFF", fontSize: 9, fontWeight: "800" },
  sellButton: {
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E6F0E6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 4,
  },
  sellPlus: { color: "#247055", fontSize: 20 },
  sellText: { color: "#247055", fontWeight: "800", fontSize: 12 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15,40,33,.45)",
    justifyContent: "flex-end",
  },
  backdropTouch: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  detail: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    maxHeight: "88%",
  },
  detailImage: { width: "100%", height: 230 },
  close: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: "#173C34", fontSize: 26 },
  detailBody: { padding: 24 },
  detailCategory: {
    color: "#23775D",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  detailTitle: {
    color: "#173C34",
    fontSize: 25,
    fontWeight: "800",
    marginTop: 8,
  },
  detailPrice: {
    color: "#1C7057",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
  muted: { color: "#87918C", fontSize: 12 },
  description: {
    color: "#66736D",
    fontSize: 14,
    lineHeight: 21,
    marginVertical: 20,
  },
  primary: {
    height: 50,
    backgroundColor: "#1F5D4C",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  primaryText: { color: "#FFF", fontWeight: "800" },
  featureActionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  featureActionBtn: {
    flex: 1,
    backgroundColor: "#F2F5F1",
    borderWidth: 1,
    borderColor: "#D2DDD5",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  featureActionBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1F5D4C",
  },
  reportListingBtn: {
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 4,
  },
  reportListingText: {
    fontSize: 11,
    color: "#A0AAA4",
    textDecorationLine: "underline",
  },
  auth: { backgroundColor: "#FFF", borderRadius: 20, padding: 24, margin: 20 },
  form: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  chat: {
    height: "78%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  chatSubtitle: { color: "#87918C", fontSize: 12, marginTop: 4 },
  messages: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingVertical: 16,
    gap: 8,
  },
  chatEmpty: { color: "#87918C", textAlign: "center", padding: 24 },
  messageBubble: {
    alignSelf: "flex-start",
    maxWidth: "82%",
    backgroundColor: "#EEF2EC",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1F5D4C",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageText: { color: "#24483D", fontSize: 14, lineHeight: 19 },
  myMessageText: { color: "#FFF" },
  messageComposer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#EEF1EC",
    paddingTop: 12,
  },
  messageInput: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: "#DDE4DC",
    borderRadius: 14,
    paddingHorizontal: 13,
    color: "#173C34",
  },
  sendButton: {
    height: 46,
    borderRadius: 14,
    backgroundColor: "#1F5D4C",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  sendText: { color: "#FFF", fontWeight: "800", fontSize: 12 },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formTitle: { color: "#173C34", fontSize: 22, fontWeight: "800" },
  authMessage: { color: "#87918C", lineHeight: 20, marginTop: 10 },
  authField: { marginTop: 20 },
  switchAuth: {
    color: "#23775D",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8EBE5" },
  dividerText: { color: "#A0AAA4", fontSize: 10, fontWeight: "700" },
  authError: {
    color: "#B64950",
    backgroundColor: "#FBECEE",
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginTop: 16,
  },
  googleButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D7DDD8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    gap: 10,
  },
  googleMark: { color: "#4285F4", fontSize: 18, fontWeight: "800" },
  outline: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#BCD0C3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  outlineText: { color: "#1F5D4C", fontWeight: "800" },
  label: {
    color: "#365B4C",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 7,
  },
  photoPicker: {
    height: 150,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDE4DC",
    borderStyle: "dashed",
    backgroundColor: "#F8F8F4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  photoPickerText: { color: "#23775D", fontWeight: "800" },
  photoPreview: { width: "100%", height: "100%" },
  field: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDE4DC",
    borderRadius: 12,
    paddingHorizontal: 14,
    color: "#173C34",
  },
  formChips: { gap: 8, paddingBottom: 4 },
  formChip: {
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: "#ECEFE9",
  },
  formChipActive: { backgroundColor: "#1F5D4C" },
  formChipText: { color: "#64736C", fontSize: 11, fontWeight: "700" },
  formChipTextActive: { color: "#FFF" },
  disabled: { opacity: 0.45 },
});
