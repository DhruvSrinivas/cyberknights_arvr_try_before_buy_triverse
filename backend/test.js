async function run() {
  console.log("--- TESTING GET PRICES ---");
  const pricesRes = await fetch("http://127.0.0.1:5001/cyberknights-arvr/us-central1/getPrices?productName=Wakefit+Orthopaedic+Sofa");
  const pricesData = await pricesRes.json();
  console.log(JSON.stringify(pricesData, null, 2));

  console.log("\n--- TESTING EXTRACT PRODUCT ---");
  const productRes = await fetch("http://127.0.0.1:5001/cyberknights-arvr/us-central1/extractProduct", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: "https://www.amazon.in/Wakefit-Orthopaedic-Fabric-Seater-Space/dp/B0BD8N9QJ6" })
  });
  const productData = await productRes.json();
  console.log(JSON.stringify(productData, null, 2));
}

run();
