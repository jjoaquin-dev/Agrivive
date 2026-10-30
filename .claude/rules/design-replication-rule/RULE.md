# TASK: Replicate Reference UI Using Existing System Fields

I will upload screenshots that serve as UI/UX design references.

Your task is to replicate the visual appearance of these screenshots while strictly preserving the existing fields and functionality of our application.

### CRITICAL RULE: EXISTING SYSTEM IS THE SOURCE OF TRUTH

The screenshot is ONLY a reference for:
- Layout and positioning
- Colors and typography
- Spacing and alignment
- Component styling
- Overall visual design

The screenshot is NOT a reference for:
- What fields should exist
- What data should be collected
- What functionality should be implemented
- What database structure should be used

### FIELD MAPPING RULES

1. Inspect our existing code to identify the actual fields currently implemented.
2. Use ONLY those existing fields when recreating the screenshot's UI.
3. NEVER add fields just because they appear in the screenshot.
4. NEVER remove existing fields just because they are absent from the screenshot.
5. NEVER rename existing fields to match the screenshot.
6. Adapt the reference layout to accommodate our actual fields.

### EXAMPLE

Reference screenshot contains:
- First Name
- Last Name
- Company
- Email
- Phone
- Department

Our existing system contains:
- Full Name
- Email
- Phone Number

EXPECTED RESULT:

Recreate the screenshot's visual design using ONLY:
- Full Name
- Email
- Phone Number

Do not introduce First Name, Last Name, Company, or Department.

### IMPLEMENTATION CONSTRAINTS

- Preserve existing field names and bindings.
- Preserve existing validation and business logic.
- Preserve API integration and database schema.
- Do not generate placeholder or mock fields.
- Do not modify unrelated components.
- Do not invent missing requirements.
- Prefer modifying styling and layout over rewriting functional code.

If the screenshot's layout cannot accommodate our existing fields exactly, intelligently adapt the layout without changing the fields themselves.

### FINAL OBJECTIVE

**Copy the DESIGN from the image, NOT its CONTENT or DATA STRUCTURE.**

The final UI should visually resemble the screenshot but function exactly like our existing application, using our existing fields exclusively.