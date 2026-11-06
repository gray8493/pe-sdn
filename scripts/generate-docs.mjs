// Generates the submission Word file.
// Page 1 = the exam template, copied exactly (plain lines, nothing above it).
// Page 2+ = project description and requirement checklist.
// Usage: node scripts/generate-docs.mjs [outputDir]
import {
  AlignmentType, BorderStyle, Document, HeadingLevel, Packer, PageBreak, Paragraph,
  ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} from "docx";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.resolve(process.argv[2] ?? repoRoot);
const STUDENT_CODE = "QE190056";
const FONT = "Calibri";
const ACCENT = "1F4E79";

const template = [
  ["Student Code", STUDENT_CODE],
  ["Full Name", "Trần Đặng Anh Thi"],
  ["GitHub Repository URL", "https://github.com/gray8493/pe-sdn"],
  ["Vercel Production URL", "https://pe-sdn-self.vercel.app"],
  ["Test account email", "grader.qe190056@example.com"],
  ["Test account password", "Test1234!"],
];

const p = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 120 }, ...opts, children: [new TextRun({ text, font: FONT, size: 22 })] });
const h1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 4 } },
    children: [new TextRun({ text, font: FONT, size: 30, bold: true, color: ACCENT })],
  });
const h2 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: FONT, size: 24, bold: true, color: ACCENT })],
  });
const bullet = (label, text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [
      ...(label ? [new TextRun({ text: `${label}: `, font: FONT, size: 22, bold: true })] : []),
      new TextRun({ text, font: FONT, size: 22 }),
    ],
  });

const cell = (text, { header = false, width, center = false } = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: header ? { type: ShadingType.CLEAR, color: "auto", fill: ACCENT } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [new TextRun({ text, font: FONT, size: 20, bold: header, color: header ? "FFFFFF" : center ? "2E7D32" : undefined })],
      }),
    ],
  });

function checklist(title, rows) {
  return [
    h2(title),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: [
            cell("Requirement", { header: true, width: 50 }),
            cell("How it is implemented", { header: true, width: 40 }),
            cell("Status", { header: true, width: 10, center: true }),
          ],
        }),
        ...rows.map(([req, how]) =>
          new TableRow({ children: [cell(req, { width: 50 }), cell(how, { width: 40 }), cell("✔ Done", { width: 10, center: true })] })
        ),
      ],
    }),
  ];
}

const sections = [
  ["2.1 Setup", [
    ["Next.js App Router + TypeScript", "Next.js 16, app/ directory, TypeScript"],
    ["Tailwind CSS + ShadCN UI (components.json, ≥ 2 components used)", "components.json; Button, Card, Input, Label in components/ui"],
    ["Builds with only DATABASE_URL, DIRECT_URL, AUTH_SECRET", "No secrets in code; .env.example lists the 3 names"],
    ["build script runs prisma generate", "\"build\": \"prisma generate && next build\""],
    ["Migrations applied and committed", "prisma/migrations (init + RLS) deployed to Supabase"],
    ["Test account registered through the app", "grader.qe190056@example.com via POST /api/auth/register"],
  ]],
  ["2.2 Data & security", [
    ["Models User and ReadingLog with exact camelCase fields", "prisma/schema.prisma"],
    ["passwordHash is a bcrypt hash", "bcryptjs, cost 10; passwords never logged"],
    ["/api/reading-logs* returns 401 without a valid session", "JWT in session_token verified on every request"],
    ["Owner always taken from the session", "userId in body/query is ignored; queries filter by session user"],
    ["Prisma query builder only, no raw SQL", "All queries use where / data"],
    ["Supabase Data API cannot read the tables", "Row Level Security enabled on both tables"],
  ]],
  ["2.3 Authentication API", [
    ["POST /api/auth/register → 201 { id, email }", "Validates input, duplicate e-mail → error"],
    ["POST /api/auth/login → 200 + HttpOnly session_token", "Wrong credentials → 401 \"Invalid email or password\""],
    ["POST /api/auth/logout → 200, clears cookie", "Later GET /api/auth/me → 401"],
    ["GET /api/auth/me → 200 { id, email } or 401", "{ error: \"Unauthorized\" }"],
  ]],
  ["2.4 Reading Log API", [
    ["GET /api/reading-logs with genre / favorite / q", "readOn desc, ties by bookTitle (case-insensitive)"],
    ["GET /api/reading-logs/summary", "count, favoriteCount, totalMinutes, ordered breakdown"],
    ["POST → 201; validation 400; duplicate 409", "Exact messages from section 2.5"],
    ["PATCH /:id (edit + favorite) → 200", "Same validation/duplicate rules; other user's id → 404"],
    ["DELETE /:id → 200 { success: true }", "Missing or other user's id → 404 \"Reading log not found\""],
  ]],
  ["2.5 – 2.7 Pages, shared state, look & feel", [
    ["Home with header, title ReadLog and 3 feature cards", "Login/Register buttons or e-mail, link, Logout"],
    ["Register / Login forms with own messages (noValidate)", "Errors only after submit, disappear when valid"],
    ["/reading-logs protected, no flash of content", "Checked on the server before rendering"],
    ["Add form with validation and success message", "List updates at once, form clears"],
    ["List, favorite toggle (aria-pressed), delete, empty state", "Updates at once and survives refresh"],
    ["Genre filter, favorites only, search, Clear, live summary", "Calls list + summary API on every change"],
    ["React Context for shared data", "Cleared on logout / when another user logs in"],
    ["Responsive 375 px and 1280 px", "No horizontal scroll; form + summary beside list on desktop"],
    ["All data-testid hooks from section 3", "Added on the exact elements"],
  ]],
];

const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  sections: [
    {
      children: [
        // ---- Page 1: exam template, copied exactly ----
        // Boxed with paragraph borders (not a table) so the text stays plain lines.
        ...template.map(([label, value], i) => {
          const line = { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 8 }
          return new Paragraph({
            shading: { type: ShadingType.CLEAR, color: "auto", fill: "EAF1FB" },
            border: {
              left: line,
              right: line,
              ...(i === 0 ? { top: line } : {}),
              ...(i === template.length - 1 ? { bottom: line } : {}),
            },
            indent: { left: 240, right: 240 },
            spacing: { before: i === 0 ? 0 : 60, after: 60, line: 300 },
            children: [
              new TextRun({ text: `${label}: `, font: FONT, size: 24, bold: true, color: ACCENT }),
              new TextRun({ text: value, font: FONT, size: 24 }),
            ],
          })
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ---- Page 2+: project description ----
        h1("ReadLog — Project Description"),
        p("ReadLog is a web app where each person tracks their own reading sessions: which book, how many minutes, what genre and when. Sessions can be marked as favorites, filtered and searched, and a live summary shows minutes read by genre."),
        h2("Tech stack"),
        bullet("Framework", "Next.js 16 (App Router, TypeScript) with REST Route Handlers"),
        bullet("Database", "PostgreSQL on Supabase, accessed only through Prisma ORM 6"),
        bullet("Authentication", "Own e-mail/password auth: bcrypt hashes + signed JWT in an HttpOnly session_token cookie"),
        bullet("UI", "Tailwind CSS 4 + ShadCN UI (Button, Card, Input, Label), lucide icons"),
        bullet("State", "React Context for the user and the reading sessions"),
        bullet("Hosting", "Vercel (region syd1, next to the Supabase database)"),
        h2("Main features"),
        bullet("", "Register, login, logout, protected reading-log page"),
        bullet("", "Add reading sessions with validation and duplicate detection"),
        bullet("", "Favorite toggle and delete, updated instantly"),
        bullet("", "Filter by genre, favorites only, search by title or note"),
        bullet("", "Live summary: sessions, favorites, total minutes, breakdown by genre"),

        new Paragraph({ children: [new PageBreak()] }),
        h1("Requirement Checklist"),
        ...sections.flatMap(([title, rows]) => checklist(title, rows)),

        h1("Verification"),
        bullet("API", "56/56 automated checks passed against https://pe-sdn-self.vercel.app"),
        bullet("Web pages", "49/49 automated browser checks passed (Playwright) against the deployed site"),
        bullet("Build", "npm install && npm run build succeeds with only the three environment variables"),
      ],
    },
  ],
});

mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `${STUDENT_CODE}.docx`);
writeFileSync(file, await Packer.toBuffer(doc));
console.log("Generated:", file);
