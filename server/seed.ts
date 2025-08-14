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
        longitude: 72.8697
      },
      {
        name: "Apollo Pharmacy",
        address: "456 Oak Avenue, Bandra East, Mumbai", 
        latitude: 19.0596,
        longitude: 72.8295
      },
      {
        name: "HealthPlus Pharmacy",
        address: "789 Elm Street, Powai, Mumbai",
        latitude: 19.1197,
        longitude: 72.9065
      },
      {
        name: "CareFirst Pharmacy",
        address: "321 Pine Road, Colaba, Mumbai",
        latitude: 18.9067,
        longitude: 72.8147
      },
      {
        name: "WellMed Pharmacy",
        address: "654 Cedar Lane, Thane West, Mumbai",
        latitude: 19.2183,
        longitude: 72.9781
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
        description: "Pain relief and fever reducer"
      },
      {
        name: "Aspirin 325mg",
        description: "Anti-inflammatory pain reliever"
      },
      {
        name: "Ibuprofen 400mg",
        description: "NSAID for pain and inflammation"
      },
      {
        name: "Cetirizine 10mg",
        description: "Antihistamine for allergies"
      },
      {
        name: "Omeprazole 20mg",
        description: "Proton pump inhibitor for acid reflux"
      },
      {
        name: "Amoxicillin 250mg",
        description: "Antibiotic for bacterial infections"
      },
      {
        name: "Metformin 500mg",
        description: "Diabetes medication"
      },
      {
        name: "Lisinopril 10mg",
        description: "ACE inhibitor for blood pressure"
      },
      {
        name: "Simvastatin 20mg",
        description: "Statin for cholesterol management"
      },
      {
        name: "Loratadine 10mg",
        description: "Non-drowsy antihistamine"
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
