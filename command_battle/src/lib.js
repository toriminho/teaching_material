//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 主人公クラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Friend
{
	// コンストラクター
	constructor(name, hp, offense, speed, herb, herbPower)
	{
		this.name = name;            // 名前
		this.type = "friend";        // 敵味方種別
		this.hp = hp;                // 体力
		this.liveFlag = true;        // 生存フラグ
		this.offense = offense;      // 攻撃力
		this.speed = speed;          // 素早さ
		this.herb = herb;            // 薬草
		this.herbPower = herbPower;  // 薬草の回復力

		this.command = "";           // 選択されたコマンド
		this.target;                 // ターゲット
	}

	// 主要なパラメータを取得する
	getMainParameter()
	{
		return "<b>" + this.name + "</b><br>"
		       + "体力 " + this.hp + "<br>"
		       + "薬草 " + this.herb + "<br>";
	}

	// コマンドビューに表示するコマンド（HTML）を返す
	//     eventが"start"の場合
	//         はじめに表示するコマンド（HTML）を返す
	//     eventがユーザのコマンド選択の結果の場合
	//         eventに応じて、表示するコマンド（HTML）を返す、
	//         または、味方1人のコマンド選択を終了させる"end"を返す
	getCommand(event)
	{
		// はじめに表示するコマンド
		if(event === "start") {
			let text = ['<div><b id="friendName">' + this.name + '</b></div>',
			            '<div id="attackCommand">攻撃</div>',
			            '<div id="recoveryCommand">薬草</div>'];
			return text;
		}

		// 選択されたコマンドのidまたはclassを取得する
		if(event.target.id != "") {
			this.command = event.target.id;
		}
		else {
			this.command = event.target.className;
		}

		// 攻撃コマンドが選択されたとき
		if(this.command === "attackCommand") {
			// 生存している敵の配列（charactors配列の要素番号）を取得する
			let livedEnemy = searchLivedCharactorByType("enemy");
			// 生存している敵をコマンドビューに表示するためのHTML
			let livedEnemyHTML = [];

			for(let c in livedEnemy) {
				livedEnemyHTML.push('<div class="enemyCommand">' +
				                    charactors[livedEnemy[c]].name + '</div>');
			}
			livedEnemyHTML.unshift('<div><b id="friendName">' + this.name + '</b></div>');

			return livedEnemyHTML;
		}
		// 敵が選択されたとき
		else if(this.command === "enemyCommand") {
			// 選択された敵をターゲットとして保存する
			this.target = charactors[searchCharactorByName(event.target.innerText)[0]];
			return "end"; 
		}
		// 薬草コマンドが選択されたとき
		else if(this.command === "recoveryCommand") {
			return "end";
		}
	}

	// 表示されたコマンドにイベントハンドラを登録する
	setEventHandler(event)
	{
		// コマンドの初期状態の場合
		if(event === "start") {
			// 攻撃コマンドのイベントハンドラを設定する
			attackCommand.addEventListener("click", command.callback);
			// 回復コマンドのイベントハンドラを設定する
			recoveryCommand.addEventListener("click", command.callback);
		}
		// 攻撃コマンドが選択された場合
		if(this.command === "attackCommand") {
			let element = document.getElementsByClassName("enemyCommand");
			for(let i = 0; i < element.length; ++i) {
				element[i].addEventListener("click", command.callback);
			}
		}
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
		// 薬草の数を確認して回復する
		if(this.herb > 0) {
			// 体力に薬草の回復力を足す
			this.hp += this.herbPower;
			// 薬草をひとつ減らす
			--this.herb;
			Message.printMessage(this.name + "は薬草を飲んだ<br>体力が" + this.herbPower + "回復した！<br>");
		}
		else {
			Message.printMessage(this.name + "は薬草を・・・<br>薬草がない！<br>");
		}
	}
}

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 敵クラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Enemy
{
	// コンストラクター
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
	// コンストラクター
	constructor(name, hp, offense, speed, path)
	{
		super(name, hp, offense, speed, path);
	}

	// 攻撃メソッド
	attack()
	{
		// 生存している味方をランダムに選択する
		let f = charactors[searchLivedCharactorRamdom("friend")];

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
	// コンストラクター
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
		let f = charactors[searchLivedCharactorRamdom("friend")];

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
		charactors.sort(
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
		for(let c in charactors) {
			if(charactors[c].type === "friend") {
				parameterView.innerHTML += '<div class="parameter">' +
				                           charactors[c].getMainParameter() + '</div>';
			}
		}

		// 敵のパラメータをコンソールに表示する（デバッグ用）
		for(let c in charactors) {
			if(charactors[c].type === "enemy" ) {
				console.log(charactors[c].name + " " + charactors[c].hp);
			}
		}
	}

	// 敵の画像を表示する
	showEnemyImage()
	{
		let i = 0;
		for(let c in charactors) {
			if(charactors[c].type === "enemy") {
				enemyImageView.innerHTML += '<img id="enemyImage' + c + '" src="' + charactors[c].path
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
	removeDiedCharactor()
	{
		for(let c in charactors) {
			if(charactors[c].hp <= 0 && charactors[c].liveFlag === true) {

				Message.addMessage(charactors[c].name + "は倒れた<br>");
				// 生存フラグを落とす
				charactors[c].liveFlag = false;

				// 敵の場合は画像を削除
				if(charactors[c].type === "enemy") {
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

		for(let c in charactors) {
			// 倒れたキャラクターはスキップする
			if(charactors[c].liveFlag === false) {
				continue;
			}

			await sleep(900);

			// 各キャラクターの行動
			charactors[c].action();

			await sleep(1100);

			// パラメータを更新する
			this.showParameter();

			await sleep(900);

			// 倒れたキャラクターの要素を空にする
			this.removeDiedCharactor();

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

//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// コマンドクラス
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
class Command
{
	constructor()
	{
		// コマンドを実行する味方
		this.friendElementNum = [];
		// 何人目の味方がコマンド選択中か（0が1人目）
		this.current = 0;
	}

	// コマンド入力の準備をする
	preparation()
	{
		// コマンドを実行する味方の配列を空にする
		this.friendElementNum.splice(0);

		// コマンドを選択する味方を配列に詰める
		for(let c in charactors) {
			if(charactors[c].type === "friend" && charactors[c].liveFlag === true) {
				this.friendElementNum.push(c);
			}
		}

		// 味方のコマンドを取得する
		let text = charactors[this.friendElementNum[this.current]].getCommand("start");

		// コマンドを表示する
		this.showCommand(text);

		// イベントハンドラを登録する
		charactors[this.friendElementNum[this.current]].setEventHandler("start");
	}

	// コマンドを表示する
	showCommand(commands)
	{
		commandView.innerHTML = commands.join("");
	}

	// コマンドをクリックしたときのコールバック関数
	callback(event)
	{
		// 味方のコマンド選択
		let result = command.commandTurn(event)

		// 味方全員のコマンド選択が終わった場合
		if(result) {
			// 戦闘開始
			let promise = gameManage.battle();

			// gameManage.battle()が終了したときに実行される
			promise.then(
				// boolは、gameManage.battle()の戻り値
				function(bool)
				{
					// 戦闘が終了していない場合、コマンドを表示する
					if(bool) {
						command.preparation();
					}
				}
			);
		}
	}

	// 味方全員のコマンド選択が終わったらtrueを返す
	commandTurn(event)
	{
		// 味方1人のコマンドを取得する
		let result = charactors[this.friendElementNum[this.current]].getCommand(event);

		// 味方1人のコマンド入力が終わりの場合
		if (result === "end") {

			// コマンドを選択していない味方が残っている場合
			if(! (this.current === this.friendElementNum.length - 1)) {
				// 次の味方
				++this.current;
				// 味方のコマンドを取得する
				let text = charactors[this.friendElementNum[this.current]].getCommand("start");
				// コマンドを表示する
				this.showCommand(text);
				// 表示されたコマンドにイベントハンドラを割り当てる
				charactors[this.friendElementNum[this.current]].setEventHandler("start");
			}
			// 味方全員のコマンド選択が終わった場合
			else {
				// コマンドビューを空白にする
				commandView.innerHTML = "";

				this.current = 0;
				return true;
			}
		}
		// 味方1人のコマンド入力が終わっていない場合
		else {
			// 次のコマンドを表示して、イベントハンドラを登録する
			this.showCommand(result);
			// 表示されたコマンドにイベントハンドラを割り当てる
			charactors[this.friendElementNum[this.current]].setEventHandler();
		}

		return false;
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
// charactors配列関連
//━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 種別（type）で指定されたキャラクターが、全滅しているか調べる
function isAliveByType(type)
{
	for(let c in charactors) {
		// 1人でも生存していればtrueを返す
		if(charactors[c].type === type && charactors[c].liveFlag === true) {
			return true;
		}
	}
	// 全滅しているときはfalseを返す
	return false;
}

// 名前でキャラクターを探索し、配列の要素番号を返す
function searchCharactorByName(name)
{
	// 探索した配列の要素番号
	let charactorElementNum = [];

	// 指定されたキャラクターを探す
	let i = 0;
	for(let c in charactors) {
		if(charactors[c].name === name) {
			charactorElementNum.push(i);
		}
		++i;
	}

	return charactorElementNum;
}

// 種別（type）で指定された生存しているキャラクターを探し、配列の要素番号を返す
function searchLivedCharactorByType(type)
{
	// 種別（type）で指定された生存しているキャラクター配列の要素番号
	let charactorElementNum = [];

	// 種別（type）で指定された生存しているキャラクターを探す
	let i = 0;
	for(let c in charactors) {
		if(charactors[c].type === type && charactors[c].liveFlag === true) {
			charactorElementNum.push(i);
		}
		++i;
	}

	return charactorElementNum;
}

// 種別（type）で指定された生存しているキャラクターの要素番号をランダムで返す
function searchLivedCharactorRamdom(type)
{
	// 生存しているキャラクター
	let livedCharactor = [];

	// 生存しているキャラクターを探して、その要素番号を配列に詰める
	let i = 0;
	for(let c in charactors) {
		if(charactors[c].type === type && charactors[c].liveFlag === true) {
			livedCharactor.push(i)
		}
		++i;
	}

	// 生存しているキャラクターのなかからランダムで1人選ぶ
	let randomValue = getRandomIntInclusive(0, livedCharactor.length - 1);

	return livedCharactor[randomValue];
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
