# Document Request / RFQ Form Brief

Status: Form Brief Draft  
Date: 2026-07-06  
Scope: Shared RFQ + Document Request logic for black, white and color masterbatch content only. No code. No development task. No final route.

## 1. Form Purpose

The form collects RFQ and document request information so the internal sales/document review team can manually evaluate product interest, application, country, exact grade scope and document suitability before replying by email.

The form must not deliver, attach, expose or display any document after submission.

## 2. Where The Form Appears

The form can support:

- Black masterbatch buyer/RFQ page
- White masterbatch buyer/RFQ page
- Color masterbatch RFQ guide
- Document Request page concept for these three product interests

This brief does not define final routes.

## 3. Required Fields

| Field | Required Condition |
|---|---|
| Name | Always required |
| Company | Always required |
| Email | Always required |
| Country / Region | Always required |
| Product Interest | Always required |
| Application | Always required |
| Documents Requested | Required if submitted from Documents page or if user selects document request intent |
| Document Purpose | Required if Documents Requested is selected |

## 4. Optional Fields

| Field | Notes |
|---|---|
| WhatsApp | Useful for export communication |
| Base Resin | Recommended for RFQ review |
| Processing Method | Recommended for RFQ review |
| Target Color / Function | Required in practice for color inquiries, optional for black/white |
| Current Problem | Helps product review |
| Product Grade / Model, if known | Buyer may enter current grade, target replacement model, or known GE grade |
| Current Grade / Supplier | Helps replacement review |
| Addition Ratio | Existing buyer usage only, not treated as GE recommendation |
| Trial Quantity | Helps quotation planning |
| Monthly Quantity | Helps quotation planning |
| Destination Port | Helps export/logistics review |
| Message | Free-form buyer details |

## 5. Document Types

Allowed request options:

- TDS
- SDS/MSDS
- COA
- RoHS-related documents
- FDA-related documents
- Food-contact related documents
- Other

Required caveat near the field:

Document availability depends on exact product grade, application and review. Compliance-related documents, if available, apply only to specific tested grades/samples.

## 6. Document Purpose Options

- Internal evaluation
- Customer approval
- Import clearance
- Compliance review
- Sample testing
- Other

## 7. Submission Behavior

- RFQ and document request forms should send submitted data to the internal sales/document review email address.
- The public website must not show, attach, expose or deliver any document after submission.
- Submitted information should allow the team to evaluate product interest, application, country, document type and document purpose.
- Documents, if suitable and available, are sent manually by email after review.
- If the backend is not ready, use a clearly stated email fallback instead of fake document delivery.

## 8. Email Notification Requirement

The internal notification email should include:

- Submission source/page context
- Submission timestamp
- Name
- Company
- Email
- WhatsApp
- Country / Region
- Product Interest
- Application
- Base Resin
- Processing Method
- Target Color / Function
- Current Problem
- Product Grade / Model, if known
- Current Grade / Supplier
- Addition Ratio
- Trial Quantity
- Monthly Quantity
- Destination Port
- Documents Requested
- Document Purpose
- Message

Email recipient:

- To be confirmed by business team.
- The form should send to the internal sales/document review email address once confirmed.

## 9. Success Message

Required success message:

"Your request has been received. Our team will review the product grade, application and document scope, then reply by email."

The success message must not say:

- Your document is ready.
- Download now.
- Certificate sent automatically.
- Your file is attached.
- Instant download is available.

## 10. Error Message

Suggested error message direction:

"We could not submit your request. Please check the required fields and try again, or contact our team by email."

If backend is not ready:

"The online form is not available yet. Please send your product interest, application, country and required documents to our team by email."

Do not imply that a document can be obtained automatically.

## 11. No-download Rules

The form and success state must not include:

- Download TDS
- Download SDS
- Download MSDS
- Download FDA report
- Download RoHS report
- Download COA
- Instant download
- Public download center
- Certificate download
- Public document library
- Auto-generated certificate delivery

## 12. Manual Review Rules

- Every document request requires manual review.
- Review must consider product interest, exact grade if known, application, country/region, document purpose and compliance scope.
- Not every product has every document.
- Compliance-related documents, if available, apply only to specific tested grades/samples.
- Documents are sent manually by email only if suitable and approved.

## 13. Data Needed For Backend Email

Minimum backend email data:

| Data | Required |
|---|---|
| Name | Yes |
| Company | Yes |
| Email | Yes |
| Country / Region | Yes |
| Product Interest | Yes |
| Application | Yes |
| Documents Requested | Yes if document request |
| Document Purpose | Yes if document request |
| Message | Optional |
| Source Page | Recommended |
| Submitted At | Recommended |

## 14. Acceptance Criteria

- Form is RFQ-driven and document-request driven.
- GE CHEMICAL & POLYMER GROUP CO., LTD is the only public entity.
- No non-GE entity names appear.
- Required fields are clearly defined.
- Document request fields are clearly defined.
- Submitted data is sent to internal sales/document review email.
- No document is shown, attached or delivered after public form submission.
- Success message exactly follows the approved review-by-email logic.
- Error message does not imply document availability.
- No public download wording appears.
- No fixed MOQ/sample/lead-time promise appears.
- If backend is unavailable, email fallback is clear and honest.
