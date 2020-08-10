import PyPDF2
import sys

path = sys.argv[1]
print(path)
def getPDFFileContentToTXT(pdfFile):
    myPDFFile = PyPDF2.PdfFileReader(pdfFile)
    with open('pdf_Content.txt', 'w') as pdf_output:
        for page in range(myPDFFile.getNumPages()):
            print(page)
            data = myPDFFile.getPage(page).extractText()
            pdf_output.write(data)
    with open('pdf_Content.txt', 'r') as myPDFContent:
        return myPDFContent.read().replace('\n', ' ')
print("co")
#pdfFileContent = getPDFFileContentToTXT('trying.pdf')
pdfFileContent = getPDFFileContentToTXT(path)
file1 = open(r"trying.txt", "a")
file1.writelines(pdfFileContent)
file1.close()
