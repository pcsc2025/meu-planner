// Sistema de Planejamento de Estudos (modo claro, moderno e responsivo + controle de cronômetro)
// Tecnologias: React + Tailwind + Recharts

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#a29bfe"];
const STORAGE_KEY = "plannerEstudos";

export default function EstudoPlanner() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [nome, setNome] = useState("");
  const [tempo, setTempo] = useState(0);
  const [horasDiarias, setHorasDiarias] = useState(3);
  const [timer, setTimer] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(false);
  const [timerPausado, setTimerPausado] = useState(false);
  const [disciplinaAtiva, setDisciplinaAtiva] = useState(null);

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      const dados = JSON.parse(salvo);
      setDisciplinas(dados.disciplinas || []);
      setHorasDiarias(dados.horasDiarias || 3);
    }
  }, []);

  useEffect(() => {
    const salvar = {
      disciplinas,
      horasDiarias,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(salvar));
  }, [disciplinas, horasDiarias]);

  useEffect(() => {
    let intervalo;
    if (timerAtivo && !timerPausado && timer > 0) {
      intervalo = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && timerAtivo) {
      setTimerAtivo(false);
      if (disciplinaAtiva !== null) {
        const novas = [...disciplinas];
        novas[disciplinaAtiva].estudado += 15;
        setDisciplinas(novas);
        alert("Tempo concluído para " + novas[disciplinaAtiva].nome);
      }
    }
    return () => clearInterval(intervalo);
  }, [timer, timerAtivo, timerPausado]);

  const adicionarDisciplina = () => {
    if (!nome || tempo <= 0) return;
    const nova = { nome, tempo: tempo * 60, estudado: 0 };
    const atualizadas = [...disciplinas, nova];
    setDisciplinas(atualizadas);
    setNome("");
    setTempo(0);
  };

  const removerDisciplina = (index) => {
    const atualizadas = [...disciplinas];
    atualizadas.splice(index, 1);
    setDisciplinas(atualizadas);
  };

  const iniciarTimer = (index) => {
    setTimer(15 * 60);
    setDisciplinaAtiva(index);
    setTimerAtivo(true);
    setTimerPausado(false);
  };

  const pausarOuRetomarTimer = () => {
    setTimerPausado((prev) => !prev);
  };

  const cancelarTimer = () => {
    setTimerAtivo(false);
    setTimer(0);
    setDisciplinaAtiva(null);
    setTimerPausado(false);
  };

  const formatarTempo = (seg) => `${String(Math.floor(seg / 60)).padStart(2, "0")}:${String(seg % 60).padStart(2, "0")}`;

  const totalPlanejado = disciplinas.reduce((acc, d) => acc + d.tempo, 0);
  const totalEstudado = disciplinas.reduce((acc, d) => acc + d.estudado, 0);
  const progresso = totalPlanejado ? ((totalEstudado / totalPlanejado) * 100).toFixed(2) : 0;
  const pieData = disciplinas.map((d) => ({ name: d.nome, value: d.tempo }));

  return <div>/* conteúdo removido para encurtar */</div>;
}