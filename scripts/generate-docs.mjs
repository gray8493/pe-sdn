import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const info = [
  ["MSSV", "QE190056"],
  ["Họ và tên", "Trần Đặng Anh Thi"],
  ["Link Vercel", "https://pe-sdn-self.vercel.app"],
  ["Link GitHub", "https://github.com/gray8493/pe-sdn"],
  ["Tài khoản test", "qe190056@demo.com / Qe190056@demo"],
];

const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          text: "THÔNG TIN NỘP BÀI",
          heading: HeadingLevel.TITLE,
          alignment: "center",
          spacing: { after: 400 },
        }),
        ...info.map(
          (item) =>
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({ text: `${item[0]}: `, bold: true }),
                new TextRun({ text: item[1] }),
              ],
            })
        ),
        new Paragraph({
          spacing: { before: 200 },
          children: [
            new TextRun({
              // TODO: cập nhật ghi chú theo đề (vd: dữ liệu mẫu có sẵn cho tài khoản test)
              text: "Đăng nhập bằng tài khoản test ở trên để vào trang Dashboard.",
              italics: true,
              color: "666666",
            }),
          ],
        }),
      ],
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
writeFileSync(path.join(repoRoot, "QE190056.docx"), buffer);
console.log("Generated:", path.join(repoRoot, "QE190056.docx"));
