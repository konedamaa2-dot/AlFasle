"use client";

import React from "react";
import { useStore } from "@/lib/store";
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  FileCheck2,
  Users,
  UserCheck,
  Settings,
  Compass,
  Award,
  BarChart3,
  Video,
  FolderKanban,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "classes"
  | "catalog"
  | "inscriptions"
  | "courses"
  | "assignments"
  | "grades"
  | "analytics"
  | "settings";

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { currentUser, inscriptions, submissions, assignments } = useStore();

  const pendingInscriptionsCount = inscriptions.filter((i) => i.status === "PENDING").length;
  const pendingGradingCount = submissions.filter((s) => s.status === "SUBMITTED").length;
  const pendingAssignmentsCount = assignments.filter((a) => new Date() <= new Date(a.dueDate)).length;

  const getNavItems = () => {
    switch (currentUser.role) {
      case "TEACHER":
        return [
          { id: "dashboard", label: "Tableau de Bord", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "classes", label: "Mes Classes", icon: <FolderKanban className="w-4 h-4" /> },
          {
            id: "inscriptions",
            label: "Préinscriptions",
            icon: <UserCheck className="w-4 h-4" />,
            badge: pendingInscriptionsCount > 0 ? pendingInscriptionsCount : null,
            badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          },
          { id: "courses", label: "Cours & Vidéos", icon: <Video className="w-4 h-4" /> },
          {
            id: "assignments",
            label: "Devoirs & Corrections",
            icon: <FileCheck2 className="w-4 h-4" />,
            badge: pendingGradingCount > 0 ? `${pendingGradingCount} à noter` : null,
            badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          },
          { id: "analytics", label: "Statistiques & Notes", icon: <BarChart3 className="w-4 h-4" /> },
        ];

      case "STUDENT":
        return [
          { id: "dashboard", label: "Mon Espace", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "classes", label: "Mes Classes Inscrites", icon: <GraduationCap className="w-4 h-4" /> },
          { id: "catalog", label: "Catalogue des Classes", icon: <Compass className="w-4 h-4" /> },
          { id: "courses", label: "Mes Cours & Leçons", icon: <BookOpen className="w-4 h-4" /> },
          {
            id: "assignments",
            label: "Mes Devoirs",
            icon: <FileCheck2 className="w-4 h-4" />,
            badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : null,
            badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          },
          { id: "grades", label: "Mes Notes & Relevés", icon: <Award className="w-4 h-4" /> },
        ];

      case "ADMIN":
        return [
          { id: "dashboard", label: "Supervision Globale", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "classes", label: "Toutes les Classes", icon: <FolderKanban className="w-4 h-4" /> },
          { id: "inscriptions", label: "Gestion des Inscriptions", icon: <Users className="w-4 h-4" /> },
          { id: "analytics", label: "Métriques & Rapports", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "settings", label: "Paramètres Plateforme", icon: <Settings className="w-4 h-4" /> },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 shrink-0 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Menu Principal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as NavTab)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isActive ? "bg-white/20 text-white border-white/30" : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick status card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-semibold text-emerald-400">Plateforme en Ligne</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Année Académique 2026-2027 • Session Automne
          </p>
        </div>
      </div>

      {/* Footer support */}
      <div className="pt-4 border-t border-slate-800/80">
        <p className="text-[10px] text-slate-500 text-center">
          AlFasle v1.0.0 • Tous droits réservés
        </p>
      </div>
    </aside>
  );
}
