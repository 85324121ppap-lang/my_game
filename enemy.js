// 敵：作る・入れる・動かす・描く（気づく敵）

// ① 作る：敵を1体作って返す関数
function createEnemy(x, vx) {
  return {
    x: x,
    y: floor.y - 32,
    w: 32,
    h: 32,
    vx: vx,
    baseSpeed: Math.abs(vx), // 最初の速さ（大きさ）を覚えておく
    alive: true,
    type: "normal" // 基本は普通の敵にする
  };
}

// ② 入れる：敵をまとめて入れる配列
let enemies = [];
enemies.push(createEnemy(200, 80));
enemies.push(createEnemy(380, -120));
enemies.push(createEnemy(540, 60));

const special = createEnemy(300, 80); // 作る（ほかの敵と同じ）
special.type = "faster";              // この敵だけを「速くなる敵」にする
enemies.push(special);                // 入れる

// ③ 動かす：プレイヤーが近づくと速くなり、離れると元の速度に戻る
function updateEnemies(dt) {
  for (const enemy of enemies) {
    // プレイヤーとの距離を調べる
    const distance = Math.abs(
      (player.x + player.w / 2) - (enemy.x + enemy.w / 2)
    );

    // 4体目（type が "faster"）だけの処理
    if (enemy.type === "faster") {
      if (distance < 150) {
        // プレイヤーが近くに来たら速くする
        if (enemy.vx > 0) {
          enemy.vx += 50 * dt;
        } else if (enemy.vx < 0) {
          enemy.vx -= 50 * dt;
        }
      } else {
        // プレイヤーが遠くに行ったら元の速度に戻す（今の向きは保つ）
        if (enemy.vx > 0) {
          enemy.vx = enemy.baseSpeed;
        } else if (enemy.vx < 0) {
          enemy.vx = -enemy.baseSpeed;
        }
      }
    }

    // 敵を動かす
    enemy.x = enemy.x + enemy.vx * dt;

    // 端を越えたら、位置を戻して、向きを反対にする
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }
    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }
  }
}

// プレイヤーとぶつかったとき
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
      enemy.alive = false;
      player.vy = -JUMP_SPEED / 2;
    }
  }
  // 生きている敵だけを残す
  enemies = enemies.filter((enemy) => enemy.alive);
}

// ④ 描く：配列の敵を1体ずつ描く
function drawEnemies() {
  for (const enemy of enemies) {
    // 敵の種類によって色を変える
    if (enemy.type === "faster") {
      ctx.fillStyle = "#ffd166"; // 気づく敵（4体目）の色
    } else {
      ctx.fillStyle = "#ff6b6b"; // 普通の敵（最初の3体）の色
    }
    ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
  }
  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}
