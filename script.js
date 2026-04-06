const nav = document.querySelector(".nav");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle?.addEventListener("click", () => {
  nav.classList.toggle("menu-open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("menu-open"));
});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const calcForm = document.getElementById("calcForm");
const calcResult = document.getElementById("calcResult");
const costBreakdown = document.getElementById("costBreakdown");

const machineRates = {
  mini: {
    name: "Minikotró",
    hourly: 24000,
    fuelPerHour: 2,
    amortizationPerHour: 4800,
    servicePerHour: 1100,
    adminPerHour: 1200,
    weekendPainPerHour: 1400
  },
  bobcat: {
    name: "Bobcat",
    hourly: 21000,
    fuelPerHour: 3.8,
    amortizationPerHour: 4200,
    servicePerHour: 1300,
    adminPerHour: 1100,
    weekendPainPerHour: 1400
  }
};

const dieselPrice = 615;

function formatFt(value) {
  return `${Math.round(value).toLocaleString("hu-HU")} Ft`;
}

function getTravelFee(distance) {
  if (distance <= 10) return 0;
  if (distance <= 25) return 12000;
  return 18000;
}

function updateCalculator() {
  const machineKey = document.getElementById("machine")?.value || "mini";
  const machine = machineRates[machineKey];
  const hours = Math.max(4, Number(document.getElementById("hours")?.value) || 4);
  const distance = Math.max(0, Number(document.getElementById("distance")?.value) || 0);

  const revenue = machine.hourly * hours + getTravelFee(distance);
  const fuelCost = machine.fuelPerHour * dieselPrice * hours;
  const amortizationCost = machine.amortizationPerHour * hours;
  const serviceCost = machine.servicePerHour * hours;
  const adminCost = machine.adminPerHour * hours + (distance > 10 ? 2500 : 1200);
  const travelCost = distance * 170;
  const weekendPainCost = machine.weekendPainPerHour * hours;
  const ownCost = fuelCost + amortizationCost + serviceCost + adminCost + travelCost + weekendPainCost;
  const margin = revenue - ownCost;

  if (calcResult) {
    calcResult.textContent = `Becsült összeg: ${formatFt(revenue)}`;
  }

  if (costBreakdown) {
    costBreakdown.innerHTML = `
      <p><strong>${machine.name}</strong>, ${hours} óra, ${distance} km:</p>
      <p>üzemanyag kb. ${formatFt(fuelCost)} • amortizáció ${formatFt(amortizationCost)} • szerviz/kopó ${formatFt(serviceCost)}</p>
      <p>admin + logisztika ${formatFt(adminCost + travelCost)} • hétvégi gerincpótlék ${formatFt(weekendPainCost)}</p>
      <p><strong>Önköltség:</strong> kb. ${formatFt(ownCost)} • <strong>maradó működési árrés:</strong> kb. ${formatFt(margin)}</p>
    `;
  }
}

calcForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateCalculator();
});

["machine", "hours", "distance"].forEach((id) => {
  document.getElementById(id)?.addEventListener("input", updateCalculator);
  document.getElementById(id)?.addEventListener("change", updateCalculator);
});

updateCalculator();
