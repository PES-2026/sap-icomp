#!/bin/bash

# Configuration
BASE_URL="http://localhost:8107"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsIm5hbWUiOiJUaGlhZ28gVmluaWNpdXMgQ29zdGEgR3VpbWFyYWVzIiwiZW1haWwiOiJ0aGlhZ28uZ3VpbWFyYWVzQGljb21wLnVmYW0uZWR1LmJyIiwicGhvbmVOdW1iZXIiOiIoOTIpIDk4MjI4LTYwMjAiLCJyZWdpc3RyYXRpb25OdW1iZXIiOiIyMjM1MzIyOSIsInVzZXJTdGF0dXMiOiJBUFBST1ZFRCIsInJvbGUiOiJQRURBR09HVUUiLCJjcmVhdGVkQXQiOiIyMDI2LTA2LTE1VDA1OjI2OjMxLjYzNVoiLCJ1cGRhdGVkQXQiOiIyMDI2LTA2LTE1VDA1OjM5OjE1LjcxMVoiLCJpYXQiOjE3ODE1MDE5NjQsImV4cCI6MTc4MTU4ODM2NH0.796-wPlr1ompfVI-AE3Chp4Q2DVwPoANg2Dh8h1b-3I"
PEDAGOGUE_ID="550e8400-e29b-41d4-a716-446655440000"
COURSE_ID="9a4a58ef-853d-4039-b6bd-636b6d41d6fb"

echo "========================================================="
echo "Testing Availability & Schedule Flow"
echo "========================================================="

echo -e "\n1. Preview Availability"
curl -s -X POST "http://localhost:8107/schedule/preview-availability" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=$TOKEN" \
  -d "{
    \"pedagogueId\": \"$PEDAGOGUE_ID\",
    \"attendanceTime\": 60,
    \"breakTime\": 15,
    \"startDate\": \"2026-07-06\",
    \"endDate\": \"2026-07-10\",
    \"startHour\": 480,
    \"endHour\": 1080
  }" | jq || echo ""

echo -e "\n2. Create Availability (10 Slots)"
curl -s -X POST "http://localhost:8107/schedule/create-availability" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=$TOKEN" \
  -d "[
    { \"date\": \"2026-07-06\", \"weekday\": \"MONDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"08:00\", \"end\": \"09:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-06\", \"weekday\": \"MONDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"09:00\", \"end\": \"10:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-06\", \"weekday\": \"MONDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"10:00\", \"end\": \"11:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-06\", \"weekday\": \"MONDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"11:00\", \"end\": \"12:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-06\", \"weekday\": \"MONDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"14:00\", \"end\": \"15:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-08\", \"weekday\": \"WEDNESDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"08:00\", \"end\": \"09:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-08\", \"weekday\": \"WEDNESDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"09:00\", \"end\": \"10:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-08\", \"weekday\": \"WEDNESDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"10:00\", \"end\": \"11:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-08\", \"weekday\": \"WEDNESDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"11:00\", \"end\": \"12:00\", \"attendanceTime\": 60 },
    { \"date\": \"2026-07-08\", \"weekday\": \"WEDNESDAY\", \"pedagogueId\": \"$PEDAGOGUE_ID\", \"start\": \"14:00\", \"end\": \"15:00\", \"attendanceTime\": 60 }
  ]" | jq || echo ""

echo "========================================================="
echo "Testing List Flow"
echo "========================================================="

echo -e "\n3. List Availability (Slots)"
curl -s -X GET "http://localhost:8107/schedule/availability?status=CREATED" \
  -H "Cookie: accessToken=$TOKEN" | jq || echo ""

echo -e "\n4. List Schedules (Appointments)"
curl -s -X GET "http://localhost:8107/schedule" \
  -H "Cookie: accessToken=$TOKEN" | jq || echo ""

echo -e "\n4.1 List Schedules (Filtered by Student Course: IComp)"
curl -s -X GET "http://localhost:8107/schedule?studentCourse=IComp" \
  -H "Cookie: accessToken=$TOKEN" | jq || echo ""

echo "========================================================="
echo "Testing Schedule Status Management"
echo "========================================================="

# Pegue um ID de agendamento real para testar
SCHEDULE_ID="substitua_pelo_id_real"

echo -e "\n5. Confirm Schedule"
curl -s -X PUT "http://localhost:8107/schedule/$SCHEDULE_ID/confirm" \
  -H "Cookie: accessToken=$TOKEN" | jq || echo ""

echo -e "\n6. Cancel Schedule"
curl -s -X PUT "http://localhost:8107/schedule/$SCHEDULE_ID/cancel" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=$TOKEN" \
  -d "{ \"reason\": \"Motivo do cancelamento via API\" }" | jq || echo ""

echo -e "\n6.1 Reschedule Schedule"
# Pegue um novo SLOT_ID para o qual deseja remarcar
NEW_SLOT_ID="id_do_novo_slot_aqui"
curl -s -X PUT "http://localhost:8107/schedule/$SCHEDULE_ID/reschedule" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=$TOKEN" \
  -d "{ \"newSlotId\": \"$NEW_SLOT_ID\", \"reason\": \"Remarcando para um horário melhor.\" }" | jq || echo ""

echo "========================================================="
echo "Testing Slot Removal Flow"
echo "========================================================="

echo -e "\n7. Remove Slot (Individual)"
SLOT_ID="substitua_pelo_id_real"
curl -s -X PUT "http://localhost:8107/schedule/availability/$SLOT_ID/remove" \
  -H "Cookie: accessToken=$TOKEN" | jq || echo ""

echo -e "\n8. Remove Many Slots (Bulk)"
curl -s -X PUT "http://localhost:8107/schedule/availability/bulk" \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=$TOKEN" \
  -d "[\"id_1\", \"id_2\"]" | jq || echo ""

echo "========================================================="
echo "Testing Student Flow (Token-based)"
echo "========================================================="

# Substitua pelo token de 64 caracteres gerado no banco/e-mail
SCHEDULE_TOKEN="64_char_hex_token_here"

echo -e "\n9. Cancel Schedule by Token"
curl -s -X PUT "http://localhost:8107/schedule/token/$SCHEDULE_TOKEN/cancel" \
  -H "Content-Type: application/json" \
  -d "{ \"reason\": \"Cancelamento feito pelo aluno via link de e-mail.\" }" | jq || echo ""

echo -e "\n10. Reschedule Schedule by Token"
# NEW_SLOT_ID="id_do_novo_slot_aqui"
curl -s -X PUT "http://localhost:8107/schedule/token/$SCHEDULE_TOKEN/reschedule" \
  -H "Content-Type: application/json" \
  -d "{ \"newSlotId\": \"$NEW_SLOT_ID\", \"reason\": \"Remarcação feita pelo aluno via link de e-mail.\" }" | jq || echo ""

echo -e "\n========================================================="
echo "Done"
