import dotenv from "dotenv";
dotenv.config();

import { storage } from "./storage";

async function seedBasicData() {
  console.log("Creating basic pharmacy and medicine data...");

  try {
    // Create a few medicines first
    const medicines = [
      {
        name: "Paracetamol 500mg",
        description: "Pain relief and fever reducer",
        manufacturer: "GSK Pharmaceuticals",
        category: "pain-relief",
        dosageForm: "tablet",
        strength: "500mg",
        requiresPrescription: 0
      },
      {
        name: "Amoxicillin 250mg",
        description: "Antibiotic for bacterial infections",
        manufacturer: "Aurobindo Pharma",
        category: "antibiotic",
        dosageForm: "capsule",
        strength: "250mg",
        requiresPrescription: 1
      }
    ];

    console.log("Creating medicines...");
    for (const medicine of medicines) {
      try {
        const created = await storage.createMedicine(medicine);
        console.log(`✓ Created medicine: ${created.name}`);
      } catch (error) {
        console.log(`→ Medicine ${medicine.name} may already exist`);
      }
    }

    // Create a sample pharmacy
    const pharmacy = {
      name: "Test Pharmacy",
      address: "123 Test Street, Mumbai",
      latitude: 19.0760,
      longitude: 72.8777,
      ownerName: "Dr. Test Owner",
      ownerPhone: "+91 9876543210",
      ownerEmail: "test@pharmacy.com",
      licenseNumber: "PH-TEST-2024-001"
    };

    console.log("Creating pharmacy...");
    try {
      const createdPharmacy = await storage.createShop(pharmacy);
      console.log(`✓ Created pharmacy: ${createdPharmacy.name} (ID: ${createdPharmacy.id})`);
    } catch (error) {
      console.log("→ Test pharmacy may already exist");
    }

    console.log("\n✅ Basic seeding completed!");
    console.log("You can now test the pharmacy management features.");
    
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

// Run seeding
seedBasicData().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error("Seeding error:", error);
  process.exit(1);
});
