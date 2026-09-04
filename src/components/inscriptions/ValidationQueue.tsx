"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { InscriptionStatus } from "@/types";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Users,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export function ValidationQueue() {
  const { inscriptions, classes, approveInscription, rejectInscription } = useStore();

  const [filterStatus, setFilterStatus] = useState<"ALL" | InscriptionStatus>("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInscriptions = inscriptions.filter((ins) => {
    const matchesStatus = filterStatus === "ALL" || ins.status === filterStatus;
    const matchesSearch =
      ins.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ins.classeTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = inscriptions.filter((i) => i.status === "PENDING").length;
  const approvedCount = inscriptions.filter((i) => i.status === "APPROVED").length;
  const rejectedCount = inscriptions.filter((i) => i.status === "REJECTED").length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            File de Validation des Préinscriptions
          </h2>
          <p className="text-xs text-slate-400">
            Examinez les motivations des candidats et validez ou refusez l'accès à vos classes
          </p>
        </div>

        {/* Quick count pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
            {pendingCount} en attente
          </span>
          <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
            {approvedCount} validées
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher un candidat, email ou classe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterStatus("PENDING")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "PENDING"
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            En Attente ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus("APPROVED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "APPROVED"
                ? "bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-600/20"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            Validées ({approvedCount})
          </button>
          <button
            onClick={() => setFilterStatus("REJECTED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === "REJECTED"
                ? "bg-rose-600 text-white font-bold shadow-lg shadow-rose-600/20"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            Refusées ({rejectedCount})
          </button>
          <button
            onClick={() => setFilterStatus("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === "ALL"
                ? "bg-indigo-600 text-white font-bold"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700"
            }`}
          >
            Toutes
          </button>
        </div>
      </div>

      {/* List of Applications */}
      <div className="space-y-3">
        {filteredInscriptions.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-2xl border border-slate-800">
            <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">Aucune candidature correspondante</p>
            <p className="text-xs text-slate-500 mt-1">
              Modifiez votre filtre pour afficher les autres préinscriptions.
            </p>
          </div>
        ) : (
          filteredInscriptions.map((ins) => {
            const currentClass = classes.find((c) => c.id === ins.classeId);

            return (
              <div
                key={ins.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                {/* Candidate Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={
                      ins.userAvatar ||
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                    }
                    alt={ins.userName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{ins.userName}</h4>
                      <span className="text-[11px] text-slate-400">({ins.userEmail})</span>
                      {ins.status === "PENDING" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                      {ins.status === "APPROVED" && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Validée
                        </span>
                      )}
                      {ins.status === "REJECTED" && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Refusée
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-indigo-300 font-medium">
                      Classe visée : <span className="text-white font-semibold">{ins.classeTitle}</span>
                    </p>

                    {ins.motivation && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mt-2 max-w-2xl">
                        <span className="font-semibold text-slate-400">Motivation :</span> «{" "}
                        {ins.motivation} »
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500 pt-1">
                      Postulé le {formatDateTime(ins.appliedAt)}
                      {currentClass &&
                        ` • Places occupées : ${currentClass.enrolledCount || 0}/${
                          currentClass.capacity
                        }`}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                  {ins.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => approveInscription(ins.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accepter
                      </button>
                      <button
                        onClick={() => rejectInscription(ins.id)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-700 text-xs font-medium transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Refuser
                      </button>
                    </>
                  )}

                  {ins.status === "APPROVED" && (
                    <button
                      onClick={() => rejectInscription(ins.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 text-xs transition-colors border border-slate-700"
                    >
                      Annuler l'admission
                    </button>
                  )}

                  {ins.status === "REJECTED" && (
                    <button
                      onClick={() => approveInscription(ins.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-900/30 text-slate-400 hover:text-emerald-300 text-xs transition-colors border border-slate-700"
                    >
                      Reconsidérer & Accepter
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
