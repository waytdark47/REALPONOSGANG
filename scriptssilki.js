document.getElementById('email-button').addEventListener('click', function() {
    const email = 'ld9650049309@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      const notif = document.getElementById('copy-notification');
      notif.style.display = 'block';
      setTimeout(() => { notif.style.display = 'none'; }, 3000);
    });
  });