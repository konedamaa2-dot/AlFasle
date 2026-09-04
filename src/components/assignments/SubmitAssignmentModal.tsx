"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Devoir } from "@/types";
import { X, Send, FileCheck2, Upload, Paperclip, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SubmitAssignmentModalProps {
  assignment: Devoir | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitAssignmentModal({
  assignment,
  isOpen,
  onClose,
}: SubmitAssignmentModalProps) {
  const { submitAssignment } = useStore();

  const [content, setContent] = useState("");
  const [attachmentName, setAttachmentName] = useState("Projet_Rendu_Final.zip");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAssignment(assignment.id, content, attachmentName);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setContent("");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Rendre un Devoir</h3>
              <p className="text-xs text-slate-400">{assignment.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">Devoir transmis au professeur !</h4>
            <p className="text-xs text-slate-300">
              Votre travail a bien été enregistré. Vous recevrez une notification dès que la note sera
              publiée.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Date limite :</span>
                <span className="font-semibold text-amber-300">{formatDate(assignment.dueDate)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Barème :</span>
                <span className="font-semibold text-slate-200">/{assignment.maxScore} points</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Commentaires / Liens (ex: GitHub, Figma, explications) *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Décrivez votre solution, ajoutez vos liens de dépôt et vos remarques pour le correcteur..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fichier joint (Archive / Rapport PDF)
              </label>
              <div className="flex items-center gap-2 p-3 bg-slate-900/80 border border-slate-700 rounded-xl">
                <Paperclip className="w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                  placeholder="Nom du fichier..."
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Valider et Soumettre
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
