const { v4: uuidv4 } = require("uuid");

let records = [];

function create(data) {
  const now = new Date().toISOString();

  const record = {
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    ...data,
  };

  records.push(record);
  return record;
}

function findById(id) {
  return records.find(r => r.id === id) || null;
}

function findByAppointmentId(appointmentId) {
  return records.filter(r => r.appointmentId === appointmentId);
}

function findByPatientId(patientId) {
  return records.filter(r => r.patientId === patientId);
}

function update(recordId, data) {
  const index = records.findIndex(r => r.id === recordId);
  if (index === -1) return null;

  const updated = {
    ...records[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  records[index] = updated;
  return updated;
}

function remove(recordId) {
  const index = records.findIndex(r => r.id === recordId);
  if (index === -1) return false;

  records.splice(index, 1);
  return true;
}

module.exports = {
  create,
  findById,
  findByAppointmentId,
  findByPatientId,
  update,
  remove,
};
