document.getElementById('adForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const form = e.target;

  if (localStorage.getItem("lastSubmit")) {
    const last = parseInt(localStorage.getItem("lastSubmit"));
    if (Date.now() - last < 600000) {
      document.getElementById("status").textContent = "⏳ Please wait before submitting again.";
      return;
    }
  }

  const data = {
    business: form.business.value.trim(),
    contact: form.contact.value.trim(),
    email: form.email.value.trim(),
    telegram: form.telegram.value.trim(),
    budget: form.budget.value.trim(),
    goals: form.goals.value.trim(),
    placements: form.placements.value.trim(),
    captcha: form.captcha.value.trim()
  };

  const sanitize = (str) => str.replace(/[<>]/g, "");
  for (let key in data) {
    data[key] = sanitize(data[key]);
  }

  if (data.captcha !== "8") {
    document.getElementById("status").textContent = "❌ CAPTCHA failed.";
    return;
  }

  const token = atob("ODQ0NTg3NjAxNjpBQUZWRHhIdWZtLUxidEVjbU5vUUtZakc4OUFVa0FNTmswZw==");
  const uid = atob("NzQ1NDM5NDQxOQ==");

  const msg = `📩 New Advertiser Submission:\n-------------------------\n🏢 Business: ${data.business}\n👤 Contact: ${data.contact}\n📧 Email: ${data.email}\n💬 Telegram: ${data.telegram}\n💰 Budget: €${data.budget}\n🎯 Goals: ${data.goals}\n📢 Current Ads: ${data.placements}\n🕒 Time: ${new Date().toLocaleString()}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: uid,
      text: msg
    })
  });

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: data.telegram,
      text: "✅ Your advertising form was received and is under review by Forum Musculo team. Thank you."
    })
  }).catch(() => {});

  localStorage.setItem("lastSubmit", Date.now().toString());
  document.getElementById("status").textContent = "✅ Submitted. We'll contact you soon.";
  form.reset();
});
