function save_score(name, score, onFinish) {
  $.post("http://13.64.119.125:8888/submit_score", {name: name, score: score}, onFinish);
}

function get_leaderboard(onFinish) {
  $.get("http://13.64.119.125:8888/highscore", onFinish);
}
