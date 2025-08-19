import dotenv from "dotenv";
dotenv.config();

import { storage } from "./storage";
import { db } from "./db";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create shops with realistic Mumbai locations
    const shopData = [
      {
        name: "MedPlus Pharmacy",
        address: "123 Main Street, Andheri West, Mumbai",
        latitude: 19.1136,
        longitude: 72.8697,
        ownerName: "Dr. Rajesh Sharma",
        ownerPhone: "+91 9876543210",
        ownerEmail: "rajesh.sharma@medplus.com",
        licenseNumber: "PH-MH-2024-001"
      },
      {
        name: "Apollo Pharmacy",
        address: "456 Oak Avenue, Bandra East, Mumbai", 
        latitude: 19.0596,
        longitude: 72.8295,
        ownerName: "Dr. Priya Patel",
        ownerPhone: "+91 9876543211",
        ownerEmail: "priya.patel@apollo.com",
        licenseNumber: "PH-MH-2024-002"
      },
      {
        name: "HealthPlus Pharmacy",
        address: "789 Elm Street, Powai, Mumbai",
        latitude: 19.1197,
        longitude: 72.9065,
        ownerName: "Dr. Amit Kumar",
        ownerPhone: "+91 9876543212",
        ownerEmail: "amit.kumar@healthplus.com",
        licenseNumber: "PH-MH-2024-003"
      },
      {
        name: "CareFirst Pharmacy",
        address: "321 Pine Road, Colaba, Mumbai",
        latitude: 18.9067,
        longitude: 72.8147,
        ownerName: "Dr. Sunita Joshi",
        ownerPhone: "+91 9876543213",
        ownerEmail: "sunita.joshi@carefirst.com",
        licenseNumber: "PH-MH-2024-004"
      },
      {
        name: "WellMed Pharmacy",
        address: "654 Cedar Lane, Thane West, Mumbai",
        latitude: 19.2183,
        longitude: 72.9781,
        ownerName: "Dr. Vikram Singh",
        ownerPhone: "+91 9876543214",
        ownerEmail: "vikram.singh@wellmed.com",
        licenseNumber: "PH-MH-2024-005"
      }
    ];

    const createdShops = [];
    for (const shop of shopData) {
      const createdShop = await storage.createShop(shop);
      createdShops.push(createdShop);
      console.log(`Created shop: ${createdShop.name}`);
    }

    // Create medicines
    const medicineData = [
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
        name: "Aspirin 325mg",
        description: "Anti-inflammatory pain reliever",
        manufacturer: "Bayer Healthcare",
        category: "pain-relief",
        dosageForm: "tablet",
        strength: "325mg",
        requiresPrescription: 0
      },
      {
        name: "Ibuprofen 400mg",
        description: "NSAID for pain and inflammation",
        manufacturer: "Cipla Limited",
        category: "pain-relief",
        dosageForm: "tablet",
        strength: "400mg",
        requiresPrescription: 0
      },
      {
        name: "Cetirizine 10mg",
        description: "Antihistamine for allergies",
        manufacturer: "Dr. Reddy's",
        category: "antihistamine",
        dosageForm: "tablet",
        strength: "10mg",
        requiresPrescription: 0
      },
      {
        name: "Omeprazole 20mg",
        description: "Proton pump inhibitor for acid reflux",
        manufacturer: "Lupin Pharmaceuticals",
        category: "gastric",
        dosageForm: "capsule",
        strength: "20mg",
        requiresPrescription: 1
      },
      {
        name: "Amoxicillin 250mg",
        description: "Antibiotic for bacterial infections",
        manufacturer: "Aurobindo Pharma",
        category: "antibiotic",
        dosageForm: "capsule",
        strength: "250mg",
        requiresPrescription: 1
      },
      {
        name: "Metformin 500mg",
        description: "Diabetes medication",
        manufacturer: "Sun Pharmaceutical",
        category: "diabetes",
        dosageForm: "tablet",
        strength: "500mg",
        requiresPrescription: 1
      },
      {
        name: "Lisinopril 10mg",
        description: "ACE inhibitor for blood pressure",
        manufacturer: "Torrent Pharmaceuticals",
        category: "cardiovascular",
        dosageForm: "tablet",
        strength: "10mg",
        requiresPrescription: 1
      },
      {
        name: "Simvastatin 20mg",
        description: "Statin for cholesterol management",
        manufacturer: "Ranbaxy Laboratories",
        category: "cardiovascular",
        dosageForm: "tablet",
        strength: "20mg",
        requiresPrescription: 1
      },
      {
        name: "Loratadine 10mg",
        description: "Non-drowsy antihistamine"
      },
      {
        name: "Ciprofloxacin 500mg",
        description: "Antibiotic for bacterial infections"
      },
      {
        name: "Doxycycline 100mg",
        description: "Antibiotic for various infections"
      },
      {
        name: "Azithromycin 250mg",
        description: "Antibiotic for respiratory infections"
      },
      {
        name: "Clopidogrel 75mg",
        description: "Blood thinner for heart conditions"
      },
      {
        name: "Amlodipine 5mg",
        description: "Calcium channel blocker for blood pressure"
      },
      {
        name: "Atorvastatin 20mg",
        description: "Statin for cholesterol management"
      },
      {
        name: "Levothyroxine 50mcg",
        description: "Thyroid hormone replacement"
      },
      {
        name: "Prednisone 10mg",
        description: "Corticosteroid for inflammation"
      },
      {
        name: "Gabapentin 300mg",
        description: "Anticonvulsant for nerve pain"
      },
      {
        name: "Tramadol 50mg",
        description: "Pain reliever for moderate pain"
      }
    ];

    const createdMedicines = [];
    for (const medicine of medicineData) {
      const createdMedicine = await storage.createMedicine(medicine);
      createdMedicines.push(createdMedicine);
      console.log(`Created medicine: ${createdMedicine.name}`);
    }

    // Create inventory with varying availability across shops
    const inventoryData = [
      // MedPlus Pharmacy (shop 1)
      { shopId: createdShops[0].id, medicineId: createdMedicines[0].id, price: "45.50", stockQuantity: 25 },
      { shopId: createdShops[0].id, medicineId: createdMedicines[1].id, price: "32.00", stockQuantity: 18 },
      { shopId: createdShops[0].id, medicineId: createdMedicines[2].id, price: "58.75", stockQuantity: 0 },
      { shopId: createdShops[0].id, medicineId: createdMedicines[3].id, price: "23.25", stockQuantity: 42 },
      { shopId: createdShops[0].id, medicineId: createdMedicines[4].id, price: "89.50", stockQuantity: 7 },
      { shopId: createdShops[0].id, medicineId: createdMedicines[5].id, price: "125.00", stockQuantity: 15 },
      { shopId: createdShops[0].id, medicineId: createdMedicines[6].id, price: "65.75", stockQuantity: 30 },

      // Apollo Pharmacy (shop 2)
      { shopId: createdShops[1].id, medicineId: createdMedicines[0].id, price: "42.00", stockQuantity: 12 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[1].id, price: "28.50", stockQuantity: 35 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[2].id, price: "55.00", stockQuantity: 20 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[3].id, price: "25.00", stockQuantity: 0 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[4].id, price: "92.00", stockQuantity: 14 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[7].id, price: "78.25", stockQuantity: 22 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[8].id, price: "145.50", stockQuantity: 8 },

      // HealthPlus Pharmacy (shop 3)
      { shopId: createdShops[2].id, medicineId: createdMedicines[0].id, price: "48.00", stockQuantity: 0 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[1].id, price: "30.75", stockQuantity: 28 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[2].id, price: "62.50", stockQuantity: 16 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[5].id, price: "118.00", stockQuantity: 9 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[6].id, price: "68.00", stockQuantity: 25 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[9].id, price: "34.25", stockQuantity: 40 },

      // CareFirst Pharmacy (shop 4)
      { shopId: createdShops[3].id, medicineId: createdMedicines[0].id, price: "44.25", stockQuantity: 33 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[2].id, price: "59.00", stockQuantity: 11 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[3].id, price: "22.50", stockQuantity: 18 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[4].id, price: "87.75", stockQuantity: 6 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[7].id, price: "75.00", stockQuantity: 19 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[8].id, price: "142.00", stockQuantity: 13 },

      // WellMed Pharmacy (shop 5)
      { shopId: createdShops[4].id, medicineId: createdMedicines[1].id, price: "29.00", stockQuantity: 45 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[2].id, price: "56.25", stockQuantity: 24 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[3].id, price: "24.75", stockQuantity: 31 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[5].id, price: "122.50", stockQuantity: 0 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[6].id, price: "63.50", stockQuantity: 27 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[9].id, price: "32.00", stockQuantity: 36 },

      // Additional medicines across shops
      // Ciprofloxacin 500mg (medicine 10)
      { shopId: createdShops[0].id, medicineId: createdMedicines[10].id, price: "95.00", stockQuantity: 18 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[10].id, price: "92.50", stockQuantity: 22 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[10].id, price: "98.75", stockQuantity: 0 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[10].id, price: "94.00", stockQuantity: 15 },

      // Doxycycline 100mg (medicine 11)
      { shopId: createdShops[0].id, medicineId: createdMedicines[11].id, price: "78.50", stockQuantity: 12 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[11].id, price: "82.25", stockQuantity: 25 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[11].id, price: "75.00", stockQuantity: 8 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[11].id, price: "79.75", stockQuantity: 30 },

      // Azithromycin 250mg (medicine 12)
      { shopId: createdShops[0].id, medicineId: createdMedicines[12].id, price: "125.00", stockQuantity: 20 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[12].id, price: "118.50", stockQuantity: 16 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[12].id, price: "130.00", stockQuantity: 14 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[12].id, price: "122.75", stockQuantity: 0 },

      // Clopidogrel 75mg (medicine 13)
      { shopId: createdShops[1].id, medicineId: createdMedicines[13].id, price: "185.00", stockQuantity: 10 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[13].id, price: "192.50", stockQuantity: 8 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[13].id, price: "188.75", stockQuantity: 12 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[13].id, price: "190.00", stockQuantity: 15 },

      // Amlodipine 5mg (medicine 14)
      { shopId: createdShops[0].id, medicineId: createdMedicines[14].id, price: "42.50", stockQuantity: 35 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[14].id, price: "38.75", stockQuantity: 28 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[14].id, price: "45.00", stockQuantity: 0 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[14].id, price: "41.25", stockQuantity: 22 },

      // Atorvastatin 20mg (medicine 15)
      { shopId: createdShops[0].id, medicineId: createdMedicines[15].id, price: "165.00", stockQuantity: 18 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[15].id, price: "172.50", stockQuantity: 12 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[15].id, price: "168.75", stockQuantity: 20 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[15].id, price: "170.00", stockQuantity: 25 },

      // Levothyroxine 50mcg (medicine 16)
      { shopId: createdShops[0].id, medicineId: createdMedicines[16].id, price: "58.50", stockQuantity: 0 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[16].id, price: "55.25", stockQuantity: 32 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[16].id, price: "62.00", stockQuantity: 15 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[16].id, price: "59.75", stockQuantity: 28 },

      // Prednisone 10mg (medicine 17)
      { shopId: createdShops[1].id, medicineId: createdMedicines[17].id, price: "72.50", stockQuantity: 14 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[17].id, price: "75.00", stockQuantity: 18 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[17].id, price: "68.75", stockQuantity: 0 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[17].id, price: "71.25", stockQuantity: 22 },

      // Gabapentin 300mg (medicine 18)
      { shopId: createdShops[0].id, medicineId: createdMedicines[18].id, price: "145.50", stockQuantity: 12 },
      { shopId: createdShops[1].id, medicineId: createdMedicines[18].id, price: "138.75", stockQuantity: 8 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[18].id, price: "142.00", stockQuantity: 16 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[18].id, price: "140.25", stockQuantity: 20 },

      // Tramadol 50mg (medicine 19)
      { shopId: createdShops[0].id, medicineId: createdMedicines[19].id, price: "85.00", stockQuantity: 25 },
      { shopId: createdShops[2].id, medicineId: createdMedicines[19].id, price: "88.50", stockQuantity: 0 },
      { shopId: createdShops[3].id, medicineId: createdMedicines[19].id, price: "82.75", stockQuantity: 18 },
      { shopId: createdShops[4].id, medicineId: createdMedicines[19].id, price: "86.25", stockQuantity: 30 },
    ];

    for (const item of inventoryData) {
      await storage.createInventory(item);
    }

    console.log("Database seeded successfully!");
    console.log(`Created ${createdShops.length} shops, ${createdMedicines.length} medicines, and ${inventoryData.length} inventory items`);
    
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}

export { seedDatabase };
