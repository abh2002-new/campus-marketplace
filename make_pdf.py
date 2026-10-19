import sys
import os

class SimplePDF:
    def __init__(self, filename, title="Campus Marketplace - Solo Presentation Speech"):
        self.filename = filename
        self.title = title
        self.pages = []
        self.current_page_ops = []
        self.page_width = 595.28  # A4 width in points
        self.page_height = 841.89 # A4 height in points
        self.margin_x = 45.0
        self.margin_top = 50.0
        self.margin_bottom = 50.0
        self.y = self.page_height - self.margin_top
        self.page_num = 1
        
    def new_page(self):
        if self.current_page_ops:
            self.draw_header_footer()
            self.pages.append(self.current_page_ops)
            self.current_page_ops = []
            self.page_num += 1
        self.y = self.page_height - self.margin_top

    def draw_header_footer(self):
        ops = []
        # Header line
        ops.append("0.75 0.82 0.78 RG 0.5 w")
        ops.append(f"{self.margin_x} {self.page_height - 35} m {self.page_width - self.margin_x} {self.page_height - 35} l S")
        # Header text
        ops.append("BT /F1 8 Tf 0.35 0.45 0.40 rg")
        ops.append(f"{self.margin_x} {self.page_height - 30} Td (CAMPUS MARKETPLACE — SOLO PRESENTATION SPEECH & VIVA GUIDE) Tj ET")
        
        # Footer line
        ops.append("0.75 0.82 0.78 RG 0.5 w")
        ops.append(f"{self.margin_x} 38 m {self.page_width - self.margin_x} 38 l S")
        # Footer text
        ops.append("BT /F1 8 Tf 0.45 0.50 0.48 rg")
        ops.append(f"{self.margin_x} 26 Td (React Native Expo SDK 57 + Firebase | 5-Member Team Division) Tj ET")
        ops.append(f"BT /F2 8 Tf {self.page_width - self.margin_x - 45} 26 Td (Page {self.page_num}) Tj ET")
        
        # Prepend header and footer to page ops
        self.current_page_ops = ops + self.current_page_ops

    def check_space(self, needed):
        if self.y - needed < self.margin_bottom:
            self.new_page()

    def add_title(self, text, subtitle=None):
        self.check_space(70)
        # Decorative banner box
        self.current_page_ops.append("0.12 0.36 0.30 rg") # dark green
        self.current_page_ops.append(f"{self.margin_x} {self.y - 48} {self.page_width - 2*self.margin_x} 54 re f")
        
        # Title text (white)
        self.current_page_ops.append("BT /F2 18 Tf 1 1 1 rg")
        self.current_page_ops.append(f"{self.margin_x + 14} {self.y - 20} Td ({self.escape_pdf(text)}) Tj ET")
        
        if subtitle:
            self.current_page_ops.append("BT /F1 10 Tf 0.85 0.93 0.88 rg")
            self.current_page_ops.append(f"{self.margin_x + 14} {self.y - 38} Td ({self.escape_pdf(subtitle)}) Tj ET")
        self.y -= 65

    def add_heading1(self, text):
        self.check_space(40)
        self.current_page_ops.append("0.12 0.36 0.30 rg") # dark green underline
        self.current_page_ops.append(f"{self.margin_x} {self.y - 4} {self.page_width - 2*self.margin_x} 1.5 re f")
        self.current_page_ops.append(f"BT /F2 13 Tf 0.09 0.23 0.20 rg")
        self.current_page_ops.append(f"{self.margin_x} {self.y} Td ({self.escape_pdf(text)}) Tj ET")
        self.y -= 22

    def add_heading2(self, text):
        self.check_space(30)
        self.current_page_ops.append(f"BT /F2 11 Tf 0.12 0.36 0.30 rg")
        self.current_page_ops.append(f"{self.margin_x} {self.y} Td ({self.escape_pdf(text)}) Tj ET")
        self.y -= 16

    def add_action_box(self, text):
        # Stage cue action box in light green/cyan
        self.check_space(28)
        w = self.page_width - 2 * self.margin_x
        self.current_page_ops.append("0.92 0.96 0.93 rg 0.70 0.82 0.74 RG 0.5 w")
        self.current_page_ops.append(f"{self.margin_x} {self.y - 14} {w} 18 re B")
        self.current_page_ops.append("BT /F3 9 Tf 0.10 0.40 0.30 rg")
        self.current_page_ops.append(f"{self.margin_x + 8} {self.y - 10} Td ({self.escape_pdf(text)}) Tj ET")
        self.y -= 22

    def add_speech(self, text):
        # Spoken text in a quote style block
        lines = self.wrap_text(text, 88)
        needed = len(lines) * 14 + 14
        self.check_space(needed)
        
        # Left bar
        top_y = self.y
        bot_y = self.y - len(lines) * 14
        self.current_page_ops.append("0.15 0.45 0.35 RG 3 w")
        self.current_page_ops.append(f"{self.margin_x + 3} {bot_y} m {self.margin_x + 3} {top_y + 4} l S")
        
        cur_y = self.y
        for line in lines:
            self.current_page_ops.append("BT /F1 9.5 Tf 0.10 0.15 0.12 rg")
            self.current_page_ops.append(f"{self.margin_x + 12} {cur_y} Td ({self.escape_pdf(line)}) Tj ET")
            cur_y -= 13.5
        self.y = cur_y - 6

    def add_bullet(self, bold_prefix, text):
        combined = f"{bold_prefix} {text}"
        lines = self.wrap_text(combined, 88)
        self.check_space(len(lines) * 13 + 4)
        
        # Bullet dot
        self.current_page_ops.append("0.12 0.36 0.30 rg")
        self.current_page_ops.append(f"{self.margin_x + 4} {self.y + 3} 3 3 re f")
        
        cur_y = self.y
        for i, line in enumerate(lines):
            self.current_page_ops.append("BT /F1 9.5 Tf 0.15 0.20 0.18 rg")
            self.current_page_ops.append(f"{self.margin_x + 14} {cur_y} Td ({self.escape_pdf(line)}) Tj ET")
            cur_y -= 13
        self.y = cur_y - 2

    def add_table_row(self, col1, col2, col3, is_header=False):
        self.check_space(20)
        w = self.page_width - 2 * self.margin_x
        c1_w = 90
        c2_w = 170
        c3_w = w - c1_w - c2_w
        
        if is_header:
            self.current_page_ops.append("0.88 0.93 0.90 rg")
            self.current_page_ops.append(f"{self.margin_x} {self.y - 12} {w} 16 re f")
            font = "/F2 8.5 Tf 0.10 0.30 0.22 rg"
        else:
            self.current_page_ops.append("0.85 0.88 0.85 RG 0.5 w")
            self.current_page_ops.append(f"{self.margin_x} {self.y - 12} m {self.margin_x + w} {self.y - 12} l S")
            font = "/F1 8.5 Tf 0.15 0.20 0.18 rg"
            
        self.current_page_ops.append(f"BT {font} {self.margin_x + 4} {self.y - 8} Td ({self.escape_pdf(col1)}) Tj ET")
        self.current_page_ops.append(f"BT {font} {self.margin_x + c1_w + 4} {self.y - 8} Td ({self.escape_pdf(col2)}) Tj ET")
        self.current_page_ops.append(f"BT {font} {self.margin_x + c1_w + c2_w + 4} {self.y - 8} Td ({self.escape_pdf(col3)}) Tj ET")
        self.y -= 17

    def add_space(self, amount):
        self.y -= amount

    def escape_pdf(self, text):
        return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

    def wrap_text(self, text, max_chars):
        words = text.split(" ")
        lines = []
        cur = []
        cur_len = 0
        for w in words:
            if cur_len + len(w) + 1 <= max_chars:
                cur.append(w)
                cur_len += len(w) + 1
            else:
                if cur:
                    lines.append(" ".join(cur))
                cur = [w]
                cur_len = len(w)
        if cur:
            lines.append(" ".join(cur))
        return lines

    def save(self):
        if self.current_page_ops:
            self.draw_header_footer()
            self.pages.append(self.current_page_ops)

        objects = []
        # Obj 1: Catalog
        objects.append("<< /Type /Catalog /Pages 2 0 R >>")
        
        # Obj 2: Pages (placeholder, will be resolved)
        # Obj 3: Font Helvetica
        # Obj 4: Font Helvetica-Bold
        # Obj 5: Font Helvetica-Oblique
        
        font1 = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
        font2 = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
        font3 = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>"
        
        page_obj_indices = []
        content_obj_indices = []
        
        # We will dynamically index objects
        # 1: Catalog
        # 2: Pages
        # 3: F1, 4: F2, 5: F3
        next_idx = 6
        for _ in self.pages:
            page_obj_indices.append(next_idx)
            next_idx += 1
            content_obj_indices.append(next_idx)
            next_idx += 1

        pages_dict = f"<< /Type /Pages /Kids [{' '.join(f'{idx} 0 R' for idx in page_obj_indices)}] /Count {len(self.pages)} >>"

        all_objs = {
            1: objects[0],
            2: pages_dict,
            3: font1,
            4: font2,
            5: font3
        }

        for i, page_ops in enumerate(self.pages):
            p_idx = page_obj_indices[i]
            c_idx = content_obj_indices[i]
            stream_content = "\n".join(page_ops)
            stream_bytes = stream_content.encode("latin-1", errors="replace")
            
            p_dict = f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.page_width:.2f} {self.page_height:.2f}] /Contents {c_idx} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> >>"
            c_dict = f"<< /Length {len(stream_bytes)} >>\nstream\n{stream_content}\nendstream"
            
            all_objs[p_idx] = p_dict
            all_objs[c_idx] = c_dict

        # Write output file
        with open(self.filename, "wb") as f:
            f.write(b"%PDF-1.4\n")
            xref_offsets = {}
            for idx in sorted(all_objs.keys()):
                xref_offsets[idx] = f.tell()
                f.write(f"{idx} 0 obj\n".encode("ascii"))
                val = all_objs[idx]
                if isinstance(val, str):
                    f.write(val.encode("latin-1", errors="replace"))
                else:
                    f.write(val)
                f.write(b"\nendobj\n")

            xref_start = f.tell()
            f.write(f"xref\n0 {len(all_objs) + 1}\n".encode("ascii"))
            f.write(b"0000000000 65535 f \n")
            for idx in sorted(all_objs.keys()):
                f.write(f"{xref_offsets[idx]:010d} 00000 n \n".encode("ascii"))
            
            f.write(f"trailer\n<< /Size {len(all_objs) + 1} /Root 1 0 R >>\nstartxref\n{xref_start}\n%%EOF\n".encode("ascii"))
        print(f"PDF successfully written to {self.filename} ({len(self.pages)} pages)")

def build_presentation_pdf(output_path):
    pdf = SimplePDF(output_path)
    
    # Page 1: Title and Introduction
    pdf.add_title("Campus Marketplace — Presentation Speech", "Delivered by Solo Presenter for 5-Member Team | Duration: 8-10 Mins")
    pdf.add_space(8)
    
    pdf.add_heading1("1. Team Roles & Equal Contribution (20% Each)")
    pdf.add_table_row("MEMBER", "MODULE ASSIGNED", "DEDICATED SOURCE FILES", is_header=True)
    pdf.add_table_row("Member 1", "Campus Discovery & Request Board", "ItemRequestsModal.tsx, ExplorePage.tsx, data.ts")
    pdf.add_table_row("Member 2", "Live Chat & Price Bargaining", "MakeOfferModal.tsx, MessagesPage.tsx")
    pdf.add_table_row("Member 3", "Listing CRUD & Safe Meetups", "MeetupSchedulerModal.tsx, MyListingsPage.tsx, ListingCard.tsx")
    pdf.add_table_row("Member 4", "Auth Security & Seller Reviews", "SellerReviewsModal.tsx, ProfilePage.tsx")
    pdf.add_table_row("Member 5", "Data Models & Content Moderation", "ReportListingModal.tsx, SavedPage.tsx, types.ts")
    pdf.add_space(10)
    
    pdf.add_heading1("2. Introduction & Problem Statement (~1.5 Mins)")
    pdf.add_action_box("[Stage Cue: Welcome panel and state project title clearly]")
    pdf.add_speech("Good morning / afternoon respected lecturers and panel members. My name is [Your Name], and today I am proud to present our software engineering project, Campus Marketplace, on behalf of our 5-member team: [Member 1], [Member 2], [Member 3], [Member 4], and myself.")
    pdf.add_speech("Every semester, university students face heavy financial hurdles purchasing textbooks, notes, and lab gear. Existing platforms like Facebook Marketplace or Ikman lack university verification, fail to filter by campus, and carry safety risks during meetups.")
    pdf.add_speech("We engineered Campus Marketplace: a secure peer-to-peer trading app built with React Native Expo SDK 57, Firebase Cloud Firestore, and Cloud Storage. We expanded an initial prototype into an enterprise student marketplace, divided equally into 5 dedicated modules.")
    
    # Page 2: Member 1 & Member 2 Modules
    pdf.new_page()
    pdf.add_heading1("3. Module 1: Campus Search & Request Board (Member 1)")
    pdf.add_action_box("[Action: Display Explore Page. Filter Moratuwa / Colombo, then tap Request Board banner]")
    pdf.add_speech("Starting with our discovery layer, engineered by Member 1. In the initial prototype, search was basic with placeholder 'North Campus' labels. Member 1 transformed this into a realistic Sri Lankan campus ecosystem:")
    pdf.add_bullet("University Localization:", "Mapped 17 Sri Lankan state universities, enabling students to filter items strictly available on their campus.")
    pdf.add_bullet("LKR Price Range Filters:", "Implemented real-time Minimum and Maximum price sliders/inputs.")
    pdf.add_bullet("Student Request Board (WTB):", "Developed ItemRequestsModal.tsx allowing students to post wanted requests with target budgets and urgency tags when items are not listed.")
    pdf.add_space(8)

    pdf.add_heading1("4. Module 2: Live Chat & Price Bargaining (Member 2)")
    pdf.add_action_box("[Action: Open a listing, tap 'Make Offer'. Show discount chips. Navigate to Messages tab]")
    pdf.add_speech("Once a buyer finds an item, communication and bargaining are the next essential steps, engineered by Member 2. In the initial project, Messages was an empty 20-line UI stub with zero database code.")
    pdf.add_bullet("Price Bargaining Engine:", "Built MakeOfferModal.tsx with discount presets (-5%, -10%, -15%, -20%), instant LKR savings calculation, and deal notes like 'Can pick up today at library'.")
    pdf.add_bullet("Real-Time Firestore Chat:", "Built MessagesPage.tsx subscribing to Firestore conversations and chronological message subcollections with server timestamps and unread previews.")
    pdf.add_space(8)

    # Page 3: Member 3 & Member 4 Modules
    pdf.new_page()
    pdf.add_heading1("5. Module 3: Seller CRUD & Safe Meetups (Member 3)")
    pdf.add_action_box("[Action: Show 'Sell' form with photo picker. Show My Listings Edit/Delete. Tap 'Safe Meetup']")
    pdf.add_speech("Next, for inventory management and physical logistics, Member 3 led development. In the base project, users could only create listings with hardcoded dummy photos, with no way to edit or delete items.")
    pdf.add_bullet("Listing CRUD & Cloud Storage:", "Connected expo-image-picker and Firebase Cloud Storage for authentic mobile gallery photo uploads, plus Edit listing forms and Delete with native alerts.")
    pdf.add_bullet("Safe Campus Meetup Coordinator:", "Built MeetupSchedulerModal.tsx designating verified safe zones inside campuses (Library Lobby, Central Canteen, Security Gate) with date/time scheduling and safety guidelines.")
    pdf.add_space(8)

    pdf.add_heading1("6. Module 4: Auth Security & Seller Reviews (Member 4)")
    pdf.add_action_box("[Action: Show Profile Sign In / Sign Up toggle. Tap 'Reviews' on a listing. Tap Back button]")
    pdf.add_speech("To guarantee student trust and eliminate scammers, Member 4 engineered our security and reputation layer. The initial base template supported only anonymous guest logins with zero seller accountability.")
    pdf.add_bullet("Email & Password Auth:", "Implemented full authentication with form validation, session persistence, and Firestore profile synchronization.")
    pdf.add_bullet("Seller Reviews System:", "Created SellerReviewsModal.tsx featuring 5-star ratings, category satisfaction metrics, student trust badges (Verified Student, Fast Responder), and peer testimonials.")
    pdf.add_bullet("Modal Touch Freeze Fix:", "Resolved a critical Android Expo Go bug where stacked native modals locked touch focus, architecting smooth single-modal view navigation with Back buttons.")
    pdf.add_space(8)

    # Page 4: Member 5, Architecture, Conclusion & Viva Q&A
    pdf.new_page()
    pdf.add_heading1("7. Module 5: Data Models & Scam Shield (Member 5)")
    pdf.add_action_box("[Action: Tap heart to toggle Saved item. Tap 'Report suspicious listing' under details]")
    pdf.add_speech("Finally, application stability, data integrity, and scam moderation were spearheaded by Member 5:")
    pdf.add_bullet("TypeScript Data Architecture:", "Architected types.ts declaring strict shared models for Listing, Conversation, Message, ItemRequest, Offer, MeetupPlan, SellerReview, and ListingReport.")
    pdf.add_bullet("Shortlist Synchronization:", "Optimized real-time Firestore saved-items subcollection sync with instant optimistic UI.")
    pdf.add_bullet("Content Moderation Shield:", "Built ReportListingModal.tsx allowing confidential reporting of fraudulent items, stolen property, and exam leaks for administrative review.")
    pdf.add_space(6)

    pdf.add_heading1("8. Architecture Highlights & Conclusion")
    pdf.add_speech("In summary: each member's feature is modularly isolated under src/features/ with zero merge conflicts. All Firebase security rules protect user data. Our TypeScript codebase compiles cleanly with zero errors (npx tsc --noEmit).")
    pdf.add_speech("Our 5-member team successfully delivered a production-ready, secure campus marketplace for Sri Lankan university students. Thank you very much, and I am now ready for your questions!")
    pdf.add_space(6)

    pdf.add_heading1("9. Viva Panel Quick Answers Cheatsheet")
    pdf.add_bullet("Q on Member 1 (Search):", "Uses in-memory & Firestore queries matching listing.university against the active campus state.")
    pdf.add_bullet("Q on Member 2 (Chat):", "Root 'conversations' collection with memberIds array, nested 'messages' subcollection ordered by server timestamp.")
    pdf.add_bullet("Q on Member 3 (Storage):", "Images are binary blobs uploaded to Firebase Cloud Storage; only the download URL string is stored in Firestore.")
    pdf.add_bullet("Q on Member 4 (Modal Fix):", "Native Android Dialogs cannot stack without trapping focus. Solved via internal view routing in a single modal.")
    pdf.add_bullet("Q on Member 5 (TypeScript):", "Strict types in types.ts guaranteed 5 developers worked concurrently with zero runtime data mismatch errors.")

    pdf.save()

if __name__ == "__main__":
    out_dir = r"d:\my projects\campus-marketplace"
    pdf_path = os.path.join(out_dir, "Campus_Marketplace_Presentation_Speech.pdf")
    build_presentation_pdf(pdf_path)
