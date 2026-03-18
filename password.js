<script>
  const correctAnswers = ["a", "c", "e"]; // correct ones
  let selected = [];

  function toggleOption(value) {
    if (selected.includes(value)) {
      selected = selected.filter(v => v !== value);
    } else {
      if (selected.length < 3) {
        selected.push(value);
      } else {
        alert("You can only select 3 options");
      }
    }
    console.log(selected);
  }

  function checkAnswers() {
    const isCorrect =
      selected.length === 3 &&
      selected.every(v => correctAnswers.includes(v));

    if (isCorrect) {
      alert("Access granted!");
      window.location.href = "nextpage.html"; // redirect
    } else {
      alert("Wrong combination!");
    }
  }

</script>