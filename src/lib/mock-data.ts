import { User, Classe, Inscription, Cours, Devoir, Soumission, AppNotification } from "@/types";

export const initialUsers: User[] = [
  {
    id: "u_teacher_1",
    name: "Prof. Sarah Mansouri",
    email: "sarah.mansouri@alfasle.edu",
    role: "TEACHER",
    bio: "Enseignante en Informatique et Développement Web, 8 ans d'expérience dans l'enseignement supérieur.",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "u_student_1",
    name: "Amine Benali",
    email: "amine.benali@student.alfasle.edu",
    role: "STUDENT",
    bio: "Étudiant passionné par le génie logiciel et les architectures cloud.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-02-01T14:30:00Z",
  },
  {
    id: "u_student_2",
    name: "Yasmine Khelifi",
    email: "yasmine.k@student.alfasle.edu",
    role: "STUDENT",
    bio: "En reconversion professionnelle vers le développement frontend React/Next.js.",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-02-05T09:15:00Z",
  },
  {
    id: "u_student_3",
    name: "Karim Ziani",
    email: "karim.ziani@student.alfasle.edu",
    role: "STUDENT",
    avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-02-12T16:45:00Z",
  },
  {
    id: "u_admin_1",
    name: "Direction AlFasle",
    email: "admin@alfasle.edu",
    role: "ADMIN",
    bio: "Administrateur principal de la plateforme AlFasle.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    createdAt: "2025-01-01T08:00:00Z",
  },
];

export const initialClasses: Classe[] = [
  {
    id: "cls_nextjs_mastery",
    title: "Développement Web Moderne avec Next.js 15 & TypeScript",
    description: "Apprenez à concevoir des applications web complètes, rapides et sécurisées avec Next.js App Router, Tailwind CSS et Supabase.",
    level: "Intermédiaire",
    category: "Informatique",
    capacity: 35,
    enrollmentMode: "MANUAL_APPROVAL",
    status: "ACTIVE",
    teacherId: "u_teacher_1",
    teacherName: "Prof. Sarah Mansouri",
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80",
    startDate: "2026-09-15",
    endDate: "2026-12-20",
    createdAt: "2026-08-20T10:00:00Z",
    enrolledCount: 24,
    pendingCount: 3,
    coursesCount: 6,
    assignmentsCount: 3,
  },
  {
    id: "cls_algo_data",
    title: "Algorithmique Avancée & Structures de Données",
    description: "Maîtrisez les graphes, arbres binaires, programmation dynamique et complexité algorithmique pour exceller en ingénierie logicielle.",
    level: "Avancé",
    category: "Mathématiques & Info",
    capacity: 25,
    enrollmentMode: "OPEN",
    status: "ACTIVE",
    teacherId: "u_teacher_1",
    teacherName: "Prof. Sarah Mansouri",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80",
    startDate: "2026-09-20",
    endDate: "2026-12-15",
    createdAt: "2026-08-22T14:00:00Z",
    enrolledCount: 18,
    pendingCount: 0,
    coursesCount: 4,
    assignmentsCount: 2,
  },
  {
    id: "cls_ui_ux_design",
    title: "Design System & UI/UX pour Développeurs",
    description: "Créez des interfaces professionnelles, accessibles et esthétiques grâce à Figma, Tailwind CSS et les principes d'ergonomie moderne.",
    level: "Débutant",
    category: "Design",
    capacity: 30,
    enrollmentMode: "MANUAL_APPROVAL",
    status: "ACTIVE",
    teacherId: "u_teacher_1",
    teacherName: "Prof. Sarah Mansouri",
    coverImage: "https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=800&auto=format&fit=crop&q=80",
    startDate: "2026-10-01",
    endDate: "2026-12-10",
    createdAt: "2026-08-25T11:00:00Z",
    enrolledCount: 12,
    pendingCount: 2,
    coursesCount: 3,
    assignmentsCount: 1,
  },
];

export const initialInscriptions: Inscription[] = [
  {
    id: "ins_1",
    userId: "u_student_1",
    userName: "Amine Benali",
    userEmail: "amine.benali@student.alfasle.edu",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    classeId: "cls_nextjs_mastery",
    classeTitle: "Développement Web Moderne avec Next.js 15 & TypeScript",
    status: "APPROVED",
    motivation: "Je souhaite perfectionner mes compétences en React et maîtriser l'écosystème Next.js pour mon projet de fin d'études.",
    appliedAt: "2026-08-28T14:20:00Z",
    reviewedAt: "2026-08-29T09:00:00Z",
  },
  {
    id: "ins_2",
    userId: "u_student_2",
    userName: "Yasmine Khelifi",
    userEmail: "yasmine.k@student.alfasle.edu",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    classeId: "cls_nextjs_mastery",
    classeTitle: "Développement Web Moderne avec Next.js 15 & TypeScript",
    status: "PENDING",
    motivation: "Après 2 ans en gestion de projet, je me reconvertis dans le dev web. J'ai déjà suivi des cours HTML/CSS/JS.",
    appliedAt: "2026-09-02T11:10:00Z",
  },
  {
    id: "ins_3",
    userId: "u_student_3",
    userName: "Karim Ziani",
    userEmail: "karim.ziani@student.alfasle.edu",
    userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    classeId: "cls_nextjs_mastery",
    classeTitle: "Développement Web Moderne avec Next.js 15 & TypeScript",
    status: "PENDING",
    motivation: "Très motivé pour apprendre le typage TypeScript appliqué à Next.js et la mise en production.",
    appliedAt: "2026-09-03T16:05:00Z",
  },
  {
    id: "ins_4",
    userId: "u_student_1",
    userName: "Amine Benali",
    userEmail: "amine.benali@student.alfasle.edu",
    classeId: "cls_algo_data",
    classeTitle: "Algorithmique Avancée & Structures de Données",
    status: "APPROVED",
    motivation: "Indispensable pour préparer mes entretiens techniques.",
    appliedAt: "2026-08-25T10:00:00Z",
    reviewedAt: "2026-08-25T10:05:00Z",
  },
];

export const initialCourses: Cours[] = [
  {
    id: "crs_1",
    classeId: "cls_nextjs_mastery",
    chapterTitle: "Module 1 : Fondations & Architecture",
    title: "1. Introduction au App Router et aux Server Components (RSC)",
    summary: "Comprendre la séparation entre composants serveur et composants client, le rendu hybride et les performances.",
    order: 1,
    status: "PUBLISHED",
    publishedAt: "2026-09-01T08:00:00Z",
    video: {
      id: "vid_1",
      title: "Explication en direct : RSC vs Client Components",
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      durationMinutes: 28,
      status: "READY",
    },
    content: `
### Objectifs de la session

1. Comprendre la différence fondamentale entre **React Server Components (RSC)** et **Client Components** (\`"use client"\`).
2. Réduire la taille du bundle JavaScript envoyé au navigateur client.
3. Exploiter le fetching de données direct en asynchrone côté serveur sans \`useEffect\`.

\`\`\`tsx
// Exemple de Server Component avec fetch direct
export default async function CourseList() {
  const res = await fetch("https://api.alfasle.edu/courses", { cache: "no-store" });
  const courses = await res.json();

  return (
    <ul className="space-y-3">
      {courses.map((course) => (
        <li key={course.id} className="p-4 bg-white rounded-lg shadow">
          {course.title}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

> 💡 **Règle d'or :** Par défaut dans Next.js App Router, tous les composants sont des Server Components. N'ajoutez \`"use client"\` que si vous avez besoin de hooks interactifs (\`useState\`, \`useEffect\`, événements \`onClick\`).
    `,
    resources: [
      { name: "Guide_AppRouter_Architecture.pdf", url: "#", size: "2.4 Mo" },
      { name: "Snippets_Server_Components.zip", url: "#", size: "850 Ko" },
    ],
  },
  {
    id: "crs_2",
    classeId: "cls_nextjs_mastery",
    chapterTitle: "Module 1 : Fondations & Architecture",
    title: "2. Routage dynamique, Layouts imbriqués et Gestion des états",
    summary: "Structurer ses routes avec des paramètres dynamiques [slug], gérer les layouts partagés et les pages de chargement.",
    order: 2,
    status: "PUBLISHED",
    publishedAt: "2026-09-03T10:00:00Z",
    video: {
      id: "vid_2",
      title: "Tutoriel pas à pas : Création des layouts et loading.tsx",
      streamUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      durationMinutes: 34,
      status: "READY",
    },
    content: `
### Les fichiers spéciaux du dossier \`app/\`

- \`layout.tsx\` : Définit l'interface partagée entre plusieurs pages enfants (ne re-render pas lors de la navigation).
- \`page.tsx\` : Le composant principal associé à l'URL.
- \`loading.tsx\` : Affiché automatiquement via React Suspense pendant le chargement des données asynchrones.
- \`error.tsx\` : Capture les erreurs d'exécution pour éviter un crash global de la page.
    `,
  },
];

export const initialAssignments: Devoir[] = [
  {
    id: "dev_1",
    classeId: "cls_nextjs_mastery",
    coursId: "crs_1",
    coursTitle: "1. Introduction au App Router et aux Server Components (RSC)",
    title: "Devoir Pratique 1 : Création d'un catalogue de cours interactif",
    instructions: `
### Consignes du devoir :
1. Créez une application Next.js 15 avec TypeScript et Tailwind CSS.
2. Implémentez une page de liste utilisant un **Server Component** qui effectue un fetch de données.
3. Ajoutez un champ de recherche interactif côté client avec \`"use client"\` et synchronisez l'URL via \`useSearchParams\`.
4. Rédigez un court rapport explicatif (format PDF ou Markdown) et fournissez le lien de votre dépôt GitHub ainsi que la capture d'écran du résultat.
    `,
    dueDate: "2026-09-18T23:59:00Z",
    maxScore: 20,
    submissionsCount: 2,
    gradedCount: 1,
    createdAt: "2026-09-02T12:00:00Z",
    attachments: [
      { name: "Cahier_des_charges_Devoir_1.pdf", url: "#", size: "1.2 Mo" },
    ],
  },
  {
    id: "dev_2",
    classeId: "cls_nextjs_mastery",
    coursId: "crs_2",
    coursTitle: "2. Routage dynamique, Layouts imbriqués et Gestion des états",
    title: "Devoir Pratique 2 : Gestion des routes dynamiques & Formulaire de validation",
    instructions: "Créer les routes `/[classId]/lessons/[lessonId]` avec validation Zod et affichage des messages d'erreur.",
    dueDate: "2026-09-25T23:59:00Z",
    maxScore: 20,
    submissionsCount: 0,
    gradedCount: 0,
    createdAt: "2026-09-04T09:00:00Z",
  },
];

export const initialSubmissions: Soumission[] = [
  {
    id: "sub_1",
    devoirId: "dev_1",
    devoirTitle: "Devoir Pratique 1 : Création d'un catalogue de cours interactif",
    classeId: "cls_nextjs_mastery",
    classeTitle: "Développement Web Moderne avec Next.js 15 & TypeScript",
    studentId: "u_student_1",
    studentName: "Amine Benali",
    studentEmail: "amine.benali@student.alfasle.edu",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    content: "Bonjour Madame, voici mon rendu pour le TP1. J'ai utilisé Server Components pour le rendu initial et un composant Client pour le filtre instantané avec debounce. Dépôt GitHub : https://github.com/amine-benali/alfasle-tp1",
    attachmentName: "Rapport_TP1_AmineBenali.pdf",
    attachmentUrl: "#",
    submittedAt: "2026-09-03T18:40:00Z",
    status: "GRADED",
    correction: {
      id: "cor_1",
      soumissionId: "sub_1",
      graderId: "u_teacher_1",
      graderName: "Prof. Sarah Mansouri",
      score: 18.5,
      maxScore: 20,
      feedback: "Excellent travail Amine ! La séparation entre composant serveur et client est parfaitement maîtrisée. L'utilisation du debounce pour la recherche est un vrai plus d'optimisation.",
      gradedAt: "2026-09-04T02:15:00Z",
    },
  },
  {
    id: "sub_2",
    devoirId: "dev_1",
    devoirTitle: "Devoir Pratique 1 : Création d'un catalogue de cours interactif",
    classeId: "cls_nextjs_mastery",
    classeTitle: "Développement Web Moderne avec Next.js 15 & TypeScript",
    studentId: "u_student_2",
    studentName: "Yasmine Khelifi",
    studentEmail: "yasmine.k@student.alfasle.edu",
    studentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    content: "Bonjour, j'ai implémenté le catalogue avec Tailwind et Next.js 15. J'ai rencontré une petite difficulté sur la pagination que j'ai résolue avec router.push().",
    attachmentName: "Projet_Catalogue_Yasmine.zip",
    attachmentUrl: "#",
    submittedAt: "2026-09-04T01:10:00Z",
    status: "SUBMITTED",
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: "notif_1",
    userId: "u_teacher_1",
    title: "Nouvelle préinscription reçue",
    message: "Yasmine Khelifi a déposé une demande d'inscription pour la classe Next.js 15 & TypeScript.",
    type: "INSCRIPTION",
    isRead: false,
    createdAt: "2026-09-02T11:10:00Z",
  },
  {
    id: "notif_2",
    userId: "u_teacher_1",
    title: "Nouveau devoir remis",
    message: "Yasmine Khelifi a soumis le Devoir Pratique 1.",
    type: "ASSIGNMENT",
    isRead: false,
    createdAt: "2026-09-04T01:10:00Z",
  },
  {
    id: "notif_3",
    userId: "u_student_1",
    title: "Devoir corrigé !",
    message: "Votre note pour le Devoir Pratique 1 est disponible (18.5/20).",
    type: "GRADE",
    isRead: false,
    createdAt: "2026-09-04T02:15:00Z",
  },
];
