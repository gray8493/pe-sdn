// Generates the submission Word file following the exam template exactly.
// Usage: node scripts/generate-docs.mjs [outputDir]
import { Document, Packer, Paragraph, TextRun } from "docx";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.resolve(process.argv[2] ?? repoRoot);

const STUDENT_CODE = "QE190056";

const lines = [
  ["Student Code", STUDENT_CODE],
  ["Full Name", "Trần Đặng Anh Thi"],
  ["GitHub Repository URL", "https://github.com/gray8493/pe-sdn"],
  ["Vercel Production URL", "https://pe-sdn-self.vercel.app"],
  ["Test account email", "grader.qe190056@example.com"],
  ["Test account password", "Test1234!"],
];

const doc = new Document({
  sections: [
    {
      children: lines.map(
        ([label, value]) =>
          new Paragraph({ children: [new TextRun(`${label}: ${value}`)] })
      ),
    },
  ],
});

mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `${STUDENT_CODE}.docx`);
writeFileSync(file, await Packer.toBuffer(doc));
console.log("Generated:", file);
