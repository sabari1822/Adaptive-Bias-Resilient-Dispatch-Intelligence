from fpdf import FPDF
import os

pdf = FPDF()

# Add Case 1
pdf.add_page()
pdf.set_font("Helvetica", style="B", size=16)
pdf.cell(200, 10, txt="FastAPI Documentation Test - Case 1", ln=1, align="C")
pdf.ln(5)

pdf.set_font("Helvetica", size=12)
pdf.multi_cell(0, 10, txt="Input parameters simulate a moderate load at 7:00 PM with 15 active orders. The screenshot below shows the request payload and the corresponding prediction response from the local FastAPI server.")
pdf.ln(5)

# Insert Image 1 (Width adjusted to fit A4 page width nicely)
pdf.image("case1.png", x=10, y=None, w=190)

pdf.ln(5)
pdf.set_font("Helvetica", style="I", size=10)
pdf.cell(200, 10, txt="Caption: Swagger UI output showing POST /predict execution for Case 1.", ln=1, align="C")

# Add Case 2
pdf.add_page()
pdf.set_font("Helvetica", style="B", size=16)
pdf.cell(200, 10, txt="FastAPI Documentation Test - Case 2", ln=1, align="C")
pdf.ln(5)

pdf.set_font("Helvetica", size=12)
pdf.multi_cell(0, 10, txt="Input parameters simulate a heavy load at 8:00 PM with 35 active orders. Notice the increased predicted prep time and dynamic dispatch threshold compared to Case 1.")
pdf.ln(5)

# Insert Image 2
pdf.image("case2.png", x=10, y=None, w=190)

pdf.ln(5)
pdf.set_font("Helvetica", style="I", size=10)
pdf.cell(200, 10, txt="Caption: Swagger UI output showing POST /predict execution for Case 2.", ln=1, align="C")

output_filename = "FastAPI_Test_Results.pdf"
pdf.output(output_filename)
print(f"Generated {output_filename} successfully.")
