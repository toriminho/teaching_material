//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 味方クラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Friend
{
	// コンストラクタ
	constructor(name, maxHp, offense, speed, herb, herbPower)
	{
		this.name = name;            // 名前
		this.type = "friend";        // 敵味方種別
		this.maxHp = maxHp;          // 最大体力
		this.hp = maxHp;             // 体力
		this.liveFlag = true;        // 生存フラグ
		this.offense = offense;      // 攻撃力
		this.speed = speed;          // 素早さ
		this.herb = herb;            // 薬草
		this.herbPower = herbPower;  // 薬草の回復力

		this.command = "";           // 選択されたコマンド
		this.target = "";            // ターゲット
	}

	// 表示用のパラメータを返す
	getMainParameter()
	{
		return "<b>" + this.name + "</b><br>"
		       + "体力 " + this.hp + "<br>"
		       + "薬草 " + this.herb + "<br>";
	}

	// 行動する
	action()
	{
		if(this.hp > 0) {
			// コマンドに応じた処理を行う
			switch(this.command) {
				// 攻撃
				case "enemyCommand":
					this.attack();
					break;
				// 回復
				case "recoveryCommand":
					this.recovery();
					break;
				default:
					Message.printMessage(this.name + "はボーッとした<br>");
			}
		}
	}

	// 攻撃する
	attack()
	{
		// 攻撃相手が生存していれば攻撃する
		if(this.target.liveFlag) {
			// 敵の体力から、自分の攻撃力を引く
			this.target.hp -= this.offense;

			// 攻撃相手の体力がマイナスになる場合は、0にする
			if(this.target.hp < 0) {
				this.target.hp = 0;
			}

			Message.printMessage(this.name + "の攻撃<br>" +
			                     this.target.name + "に" + this.offense + "のダメージを与えた！<br>");
		}
		else {
			Message.printMessage(this.name + "の攻撃・・・<br>" + this.target.name + "は倒れている<br>");
		}
	}

	// 回復する
	recovery()
	{
		// 薬草がない場合
		if(this.herb <= 0) {
			Message.printMessage(this.name + "は薬草を・・・<br>薬草がない！<br>");
			return;
		}

		// 体力が最大体力の場合
		if(this.maxHp == this.hp) {
			Message.printMessage(this.name + "は薬草を・・・<br>これ以上回復できない！<br>");
			return;
		}
		
		// 回復する値
		let heal = this.herbPower;

		// 最大体力を超えて回復してしまいそうな場合
		if(this.maxHp - this.hp < this.herbPower) {
			heal = this.maxHp - this.hp;
		}

		// 体力を回復する
		this.hp += heal;

		// 薬草をひとつ減らす
		--this.herb;

		Message.printMessage(this.name + "は薬草を飲んだ<br>体力が" + heal + "回復した！<br>");
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 敵クラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Enemy
{
	// コンストラクタ
	constructor(name, hp, offense, speed, path)
	{
		this.name = name;        // 名前
		this.type = "enemy";     // 敵味方種別
		this.hp = hp;            // 体力
		this.liveFlag = true;    // 生存フラグ
		this.offense = offense;  // 攻撃力
		this.speed = speed;      // 素早さ
		this.path = path         // 画像の場所
	}

	// 行動する
	action()
	{
		if(this.hp > 0) {
			this.attack();
		}
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// トロルクラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Troll extends Enemy
{
	// コンストラクタ
	constructor(name, hp, offense, speed, path)
	{
		super(name, hp, offense, speed, path);
	}

	// 攻撃メソッド
	attack()
	{
		// 生存している味方をランダムに選択する
		let f = characters[searchLivedcharacterRamdom("friend")];

		// 攻撃対象の体力から、自分の攻撃力を引く
		f.hp -= this.offense;

		// 攻撃相手の体力がマイナスになる場合は0にする
		if(f.hp < 0) {
			f.hp = 0;
		}

		// 攻撃相手が生存していれば攻撃
		if(f.liveFlag) {
			Message.printMessage(this.name + "が襲いかかってきた<br>" +
			                     f.name + "は" + this.offense + "のダメージを受けた！<br>");
		}
		else {
			Message.printMessage(this.name + "の攻撃・・・<br>" + f.name + "は倒れている<br>");
		}
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ドラゴンクラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Dragon extends Enemy
{
	// コンストラクタ
	constructor(name, hp, offense, speed, path)
	{
		super(name, hp, offense, speed, path);
	}

	// 攻撃メソッド
	attack()
	{
		// 一定の確率で攻撃をミスする
		if(getRandomIntInclusive(0, 4) === 4) {
			Message.printMessage("ドラゴンは<br>グフッグフッと咳き込んでいる・・・<br>");
			return;
		}

		// 生存している味方をランダムに選択する
		let f = characters[searchLivedcharacterRamdom("friend")];

		// 攻撃対象の体力から、自分の攻撃力を引く
		f.hp -= this.offense;

		// 攻撃相手の体力がマイナスになる場合は0にする
		if(f.hp < 0) {
			f.hp = 0;
		}

		// 攻撃相手が生存していれば攻撃
		if(f.liveFlag) {	
			Message.printMessage(this.name + "は炎を吹いた<br>" +
			                     f.name + "は" + this.offense + "のダメージを受けた！<br>");
		}
		else {
			Message.printMessage(this.name + "の攻撃・・・<br>" + f.name + "は倒れている<br>");
		}
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ゲーム管理クラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class GameManage
{
	// コンストラクタ
	constructor()
	{
		// 行動の順番を決める
		this.actionOrder();

		// パラメータを表示する
		this.showParameter();

		// 敵の画像を表示する
		this.showEnemyImage();

		// はじめのメッセージを表示する
		this.showFirstMessage();
	}

	// 行動の順番を決める
	actionOrder()
	{
		// 素早さでソートする
		characters.sort(
			function (a, b)
			{
				return b.speed - a.speed;
			}
		);
	}

	// パラメータを表示または更新する
	showParameter()
	{
		// パラメータを消去する
		parameterView.innerHTML = "";

		// 味方のパラメータを表示する
		for(let c in characters) {
			if(characters[c].type === "friend") {
				parameterView.innerHTML += '<div class="parameter">' +
				                           characters[c].getMainParameter() + '</div>';
			}
		}

		// 敵のパラメータをコンソールに表示する（デバッグ用）
		for(let c in characters) {
			if(characters[c].type === "enemy" ) {
				console.log(characters[c].name + " " + characters[c].hp);
			}
		}
	}

	// 敵の画像を表示する
	showEnemyImage()
	{
		let i = 0;
		for(let c in characters) {
			if(characters[c].type === "enemy") {
				enemyImageView.innerHTML += '<img id="enemyImage' + c + '" src="' + characters[c].path
				+ '" style="position:absolute; left:' + (160 * i++) +'px; bottom: 0px">';
			}
		}
	}

	// 戦闘開始時のメッセージを表示する
	showFirstMessage()
	{
		Message.printMessage("モンスターが現れた<br>");
	}

	// 倒れたキャラクターを処理する
	removeDiedCharacter()
	{
		for(let c in characters) {
			if(characters[c].hp <= 0 && characters[c].liveFlag === true) {

				Message.addMessage(characters[c].name + "は倒れた<br>");
				// 生存フラグを落とす
				characters[c].liveFlag = false;

				// 敵の場合は画像を削除
				if(characters[c].type === "enemy") {
					document.getElementById("enemyImage" + c).remove();
				}
			}
		}
	}

	// 勝敗の判定をする
	jadgeWinLose()
	{
		// 味方が残っていなければゲームオーバー
		if(! isAliveByType("friend")) {
			Message.addMessage("全滅しました・・・<br>");
			return "lose";
		}

		// 敵が残っていなければ勝利
		if(! isAliveByType("enemy")) {
			Message.addMessage("モンスターをやっつけた<br>");
			return "win";
		}

		return "none";
	}

	// 1ターン
	async battle()
	{
		// 勝敗
		let winLose = "none";

		for(let c in characters) {
			// 倒れたキャラクターはスキップする
			if(characters[c].liveFlag === false) {
				continue;
			}

			await sleep(900);

			// 各キャラクターの行動
			characters[c].action();

			await sleep(1100);

			// パラメータを更新する
			this.showParameter();

			await sleep(900);

			// 倒れたキャラクターを処理する
			this.removeDiedCharacter();

			await sleep(300);

			// 勝敗の判定をする
			winLose = this.jadgeWinLose();

			// 決着がついた場合
			if(winLose === "win" || winLose === "lose") {
				return false;
			}
		}
		return true;
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// メッセージクラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Message
{
	// メッセージを表示する
	static printMessage(text)
	{
		messageView.innerHTML = text;
	}

	// メッセージを追加する
	static addMessage(text)
	{
		messageView.innerHTML += text;
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// characters配列関連
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 種別（type）で指定されたキャラクターが、全滅しているか調べる
function isAliveByType(type)
{
	for(let c in characters) {
		// 1人でも生存していればtrueを返す
		if(characters[c].type === type && characters[c].liveFlag === true) {
			return true;
		}
	}
	// 全滅しているときはfalseを返す
	return false;
}

// 名前でキャラクターを探索し、配列の要素番号を返す
function searchCharacterByName(name)
{
	// 探索した配列の要素番号
	let characterElementNum = [];

	// 指定されたキャラクターを探す
	let i = 0;
	for(let c in characters) {
		if(characters[c].name === name) {
			characterElementNum.push(i);
		}
		++i;
	}

	return characterElementNum;
}

// 種別（type）で指定された生存しているキャラクターを探し、配列の要素番号を返す
function searchLivedcharacterByType(type)
{
	// 種別（type）で指定された生存しているキャラクター配列の要素番号
	let characterElementNum = [];

	// 種別（type）で指定された生存しているキャラクターを探す
	let i = 0;
	for(let c in characters) {
		if(characters[c].type === type && characters[c].liveFlag === true) {
			characterElementNum.push(i);
		}
		++i;
	}

	return characterElementNum;
}

// 種別（type）で指定された生存しているキャラクターの要素番号をランダムで返す
function searchLivedcharacterRamdom(type)
{
	// 生存しているキャラクター
	let livedcharacter = [];

	// 生存しているキャラクターを探して、その要素番号を配列に詰める
	let i = 0;
	for(let c in characters) {
		if(characters[c].type === type && characters[c].liveFlag === true) {
			livedcharacter.push(i)
		}
		++i;
	}

	// 生存しているキャラクターのなかからランダムで1人選ぶ
	let randomValue = getRandomIntInclusive(0, livedcharacter.length - 1);

	return livedcharacter[randomValue];
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ツール
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// msミリ秒スリープする
function sleep(ms)
{
	return new Promise(
		function(resolve)
		{
			// msミリ秒スリープする
			setTimeout(resolve, ms);
		}
	);
}

// minからmaxまでのランダムな整数を返す
function getRandomIntInclusive(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
