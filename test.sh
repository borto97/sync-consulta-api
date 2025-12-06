#!/bin/bash

BASE_URL="http://localhost:3001/api"

echo "===================================="
echo "1) Criando PROFISSIONAL"
echo "===================================="

P=$(curl -s -X POST $BASE_URL/practitioners \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Dr Update\",\"specialty\":\"Psicologia\",\"email\":\"drupdate@example.com\",\"defaultSessionDuration\":30,\"timezone\":\"America/Sao_Paulo\"}")

echo "$P" | jq
P_ID=$(echo "$P" | jq -r '.id')
echo "P_ID=$P_ID"
echo


echo "===================================="
echo "2) Criando DISPONIBILIDADE 08–12"
echo "===================================="

curl -s -X POST $BASE_URL/practitioners/$P_ID/availabilities \
  -H "Content-Type: application/json" \
  -d "{\"dayOfWeek\":\"monday\",\"startTime\":\"08:00\",\"endTime\":\"12:00\"}" | jq
echo


echo "===================================="
echo "3) Criando BLOQUEIO 09:00–10:00"
echo "===================================="

curl -s -X POST $BASE_URL/practitioners/$P_ID/blocks \
  -H "Content-Type: application/json" \
  -d "{\"date\":\"2025-12-15\",\"startTime\":\"09:00\",\"endTime\":\"10:00\"}" | jq
echo


echo "===================================="
echo "4) Checando SLOTS (9h deve SUMIR)"
echo "===================================="

curl -s "$BASE_URL/practitioners/$P_ID/slots?date=2025-12-15" | jq
echo


echo "===================================="
echo "5) Criando APPOINTMENT 08:00–08:30"
echo "===================================="

A=$(curl -s -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -d "{\"practitionerId\":\"$P_ID\",\"patientName\":\"Paciente Teste\",\"patientPhone\":\"51999999999\",\"startTime\":\"2025-12-15T08:00:00\",\"duration\":30}")

echo "$A" | jq
A_ID=$(echo "$A" | jq -r '.id')
echo "A_ID=$A_ID"
echo


echo "===================================="
echo "6) UPDATE válido (duration 40)"
echo "===================================="

curl -s -X PUT $BASE_URL/appointments/$A_ID \
  -H "Content-Type: application/json" \
  -d "{\"duration\":40}" | jq
echo


echo "===================================="
echo "7) UPDATE inválido – entrar no BLOQUEIO (duration 70)"
echo "===================================="

curl -s -X PUT $BASE_URL/appointments/$A_ID \
  -H "Content-Type: application/json" \
  -d "{\"duration\":70}" | jq
echo


echo "===================================="
echo "8) UPDATE inválido – startTime dentro do BLOQUEIO"
echo "===================================="

curl -s -X PUT $BASE_URL/appointments/$A_ID \
  -H "Content-Type: application/json" \
  -d "{\"startTime\":\"2025-12-15T09:00:00\"}" | jq
echo


echo "===================================="
echo "9) Criando APPOINTMENT 10:30–11:00"
echo "===================================="

B=$(curl -s -X POST $BASE_URL/appointments \
  -H "Content-Type: application/json" \
  -d "{\"practitionerId\":\"$P_ID\",\"patientName\":\"Outro paciente\",\"patientPhone\":\"51988888888\",\"startTime\":\"2025-12-15T10:30:00\",\"duration\":30}")

echo "$B" | jq
echo


echo "===================================="
echo "10) UPDATE CONFLITO PARCIAL – deve falhar"
echo "===================================="

curl -s -X PUT $BASE_URL/appointments/$A_ID \
  -H "Content-Type: application/json" \
  -d "{\"startTime\":\"2025-12-15T10:20:00\"}" | jq
echo

echo "===================================="
echo "FIM DO TESTE"
echo "===================================="
