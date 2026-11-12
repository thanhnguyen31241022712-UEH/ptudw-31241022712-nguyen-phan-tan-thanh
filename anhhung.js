// BÀI TẬP 1: Tên, MSSV và lời giới thiệu.
var ten = "Nguyễn Phan Tân Thành";
var MSSV = "31241022712";
document.getElementById("gioi-thieu").textContent =
    "Tôi tên là " + ten + " – MSSV: " + MSSV + " sẽ quyết tâm trở thành 1 anh hùng JS";

// Thêm một dòng vào trang và ghi vào Console để dễ theo dõi.
function hienThi(noiDung) {
    var dong = document.createElement("p");
    dong.textContent = noiDung;
    var nhatKy = document.getElementById("nhat-ky");
    nhatKy.appendChild(dong);
    nhatKy.scrollTop = nhatKy.scrollHeight;
    console.log(noiDung);
}

// Hiệu ứng tự vẽ bằng SVG và âm thanh tạo bằng Web Audio, không cần tải tệp ngoài.
var batAmThanh = true;
var boTaoAm = null;
var nutAmThanh = document.getElementById("am-thanh");
nutAmThanh.addEventListener("click", function () {
    batAmThanh = !batAmThanh;
    nutAmThanh.textContent = batAmThanh ? "🔊 Âm thanh: Bật" : "🔇 Âm thanh: Tắt";
    nutAmThanh.setAttribute("aria-pressed", String(batAmThanh));
    if (batAmThanh) khoiTaoAmThanh();
});
function khoiTaoAmThanh() {
    try {
        var AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        if (!boTaoAm) boTaoAm = new AudioContextClass();
        if (boTaoAm.state === "suspended") boTaoAm.resume().catch(function () {});
    } catch (error) { boTaoAm = null; }
}
function phatAm(loai) {
    if (!batAmThanh || !boTaoAm) return;
    try {
        var t = boTaoAm.currentTime;
        var oscillator = boTaoAm.createOscillator();
        var gain = boTaoAm.createGain();
        oscillator.type = loai === "rong" ? "sawtooth" : "triangle";
        var dau = loai === "ne" ? 620 : loai === "rong" ? 180 : loai === "thang" ? 660 : 430;
        var cuoi = loai === "ne" ? 900 : loai === "rong" ? 55 : loai === "thang" ? 990 : 95;
        oscillator.frequency.setValueAtTime(dau, t);
        oscillator.frequency.exponentialRampToValueAtTime(cuoi, t + 0.24);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.10, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        oscillator.connect(gain); gain.connect(boTaoAm.destination);
        oscillator.start(t); oscillator.stop(t + 0.31);
    } catch (error) { /* Trò chơi vẫn hoạt động nếu trình duyệt không hỗ trợ âm thanh. */ }
}
function doi(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
async function hieuUng(ben, ketQua, giaTri) {
    var hero = document.getElementById("hero-fighter");
    var dragon = document.getElementById("dragon-fighter");
    var attacker = ben === "hero" ? hero : dragon;
    var defender = ben === "hero" ? dragon : hero;
    var effect = document.getElementById("combat-effect");
    var svg = document.getElementById("effect-svg");
    var damage = document.getElementById("damage");
    attacker.classList.add(ben === "hero" ? "hero-action" : "dragon-action");
    defender.classList.add(ketQua === "ne" ? "dodge" : "hit");
    svg.innerHTML = ben === "hero"
        ? '<path d="M22 108 Q72 14 178 15 Q99 46 34 116Z" fill="#fff1b0" stroke="#ffb95f" stroke-width="4"/><path d="M47 110 Q89 49 168 37" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
        : '<path d="M184 69 Q136 18 112 39 Q94 7 74 41 Q51 29 20 68 Q48 60 59 103 Q83 81 95 111 Q119 85 145 100 Q135 78 184 69Z" fill="#ff712f" stroke="#ffd079" stroke-width="4"/><path d="M145 68 Q105 45 85 71 Q72 56 49 75 Q78 74 91 97 Q108 75 145 68Z" fill="#fff19b"/>';
    damage.textContent = ketQua === "ne" ? "NÉ ĐÒN!" : "−" + giaTri;
    effect.classList.add("show");
    phatAm(ketQua === "ne" ? "ne" : ben === "hero" ? "chem" : "rong");
    await doi(650);
    effect.classList.remove("show");
    attacker.classList.remove("hero-action", "dragon-action");
    defender.classList.remove("dodge", "hit");
}

document.getElementById("bat-dau").addEventListener("click", function () { if (batAmThanh) khoiTaoAmThanh(); });
// BÀI TẬP 7: Hai hàm dùng trong trận chiến.
function neDon(agility) {
    return Math.random() * 100 < agility;
}

function tinhMauConLai(mau, satThuong) {
    return Math.max(0, mau - satThuong);
}

async function batDauHanhTrinh() {
    var nutBatDau = document.getElementById("bat-dau");
    var nutTanCong = document.getElementById("tan-cong");
    var nutTraLoi = document.getElementById("tra-loi");
    nutBatDau.disabled = true;
    nutTraLoi.disabled = true;
    document.getElementById("nhat-ky").textContent = "";
    document.getElementById("trang-thai").textContent = "Hãy xác nhận tên và chọn phân cấp để bước vào trận đấu.";

    // BÀI TẬP 2: Chỉ số ban đầu.
    var level = 1;
    var xp = 0;
    var skillPoints = 5;
    hienThi("Ban đầu: cấp " + level + ", XP " + xp + ", điểm kĩ năng " + skillPoints + ".");

    // Nâng cấp theo yêu cầu sau Quest 2.
    level++;
    xp = 150 * (level - 1) + 200;
    skillPoints = skillPoints + xp / 10;
    hienThi(ten + " sẽ là Anh Hùng Javascript");
    hienThi("Cấp độ hiện tại của bạn là " + level);
    hienThi("XP: " + xp + " | Điểm kĩ năng: " + skillPoints);

    // BÀI TẬP 3: Tính các chỉ số.
    var strength = skillPoints * 0.6 + xp * 0.1;
    var agility = skillPoints * 0.2 + xp * 0.2;
    var intel = skillPoints * 0.2 + level * 10;
    hienThi("Chỉ số strength của bạn là " + strength);
    hienThi("Chỉ số agility của bạn là " + agility);
    hienThi("Chỉ số intel của bạn là " + intel);
    level = 3;
    xp += 200;
    hienThi("LEVEL UP! Cấp " + level + " | XP: " + xp);

    // BÀI TẬP 4: Kiểm tra tên và chọn phân cấp.
    var tenNhap = prompt("Hãy nhập lại tên của bạn:");
    if (tenNhap === null) {
        hienThi("Bạn đã hủy hành trình. Nhấn Bắt đầu hành trình để thử lại.");
        nutBatDau.disabled = false;
        document.getElementById("trang-thai").textContent = "Bạn đã hủy. Nhấn Bắt đầu hành trình để thử lại.";
        return;
    }
    if (tenNhap === ten) {
        intel += 5;
        hienThi("Chính xác! Bạn có trí nhớ rất tốt! intel +5!");
    } else {
        intel -= 5;
        hienThi("Tệ thật! Tên chính mình mà không nhớ sao?! intel -5!");
    }

    var phancap = "Chưa chọn";
    var luaChon = prompt("Bạn muốn chọn phân cấp nào? a: Chiến Binh | b: Sát Thủ | c: Thợ Săn");
    if (luaChon === null) {
        hienThi("Bạn đã hủy hành trình. Nhấn Bắt đầu hành trình để thử lại.");
        nutBatDau.disabled = false;
        document.getElementById("trang-thai").textContent = "Bạn đã hủy. Nhấn Bắt đầu hành trình để thử lại.";
        return;
    }
    if (luaChon === "a") {
        phancap = "Chiến Binh";
        strength += 15;
        agility -= 10;
        intel -= 5;
    } else if (luaChon === "b") {
        phancap = "Sát Thủ";
        strength -= 15;
        agility += 10;
        intel += 5;
    } else if (luaChon === "c") {
        phancap = "Thợ Săn";
        strength -= 15;
        intel += 15;
    }
    level = 4;
    xp += 700;
    document.getElementById("stat-strength").textContent = strength;
    document.getElementById("stat-agility").textContent = agility;
    document.getElementById("stat-intel").textContent = intel;
    document.getElementById("stat-class").textContent = phancap;
    document.getElementById("arena-class").textContent = phancap;
    document.getElementById("stat-level").textContent = level;
    document.getElementById("stat-xp").textContent = xp + " XP";
    hienThi("Phân cấp: " + phancap + " | strength: " + strength + " | agility: " + agility + " | intel: " + intel);
    hienThi("LEVEL UP! Cấp " + level + " | XP: " + xp);

    // BÀI TẬP 5, 6 VÀ 7: Trận chiến, hiển thị máu và lịch sử trên trang.
    level = 5;
    var health = level + 100;
    var dragonHealth = 600;
    var dragonStr = 100;
    var dragonAgi = 15;
    var dragonInt = 80;
    var gameContinue = true;
    var luot = 1;
    function capNhatMau() {
        document.getElementById("mau").textContent = "Máu anh hùng: " + health + " / 105 | Máu rồng: " + dragonHealth + " / 600";
        document.getElementById("hero-health").textContent = health + " / 105";
        document.getElementById("dragon-health").textContent = dragonHealth + " / 600";
        document.getElementById("hero-bar").style.width = (health / 105 * 100) + "%";
        document.getElementById("dragon-bar").style.width = (dragonHealth / 600 * 100) + "%";
    }
    capNhatMau();
    document.getElementById("stat-level").textContent = level;
    document.getElementById("trang-thai").textContent = "Trận đấu bắt đầu! Nhấn Tấn công để ra đòn.";
    hienThi("BẮT ĐẦU TRẬN ĐẤU! Nhấn Tấn công để chơi từng lượt.");
    nutTanCong.disabled = false;
    while (gameContinue) {
        // Chờ người chơi nhấn nút trước mỗi lượt.
        await new Promise(function (resolve) {
            nutTanCong.addEventListener("click", resolve, { once: true });
        });
        nutTanCong.disabled = true;
        hienThi("--- Lượt " + luot + " ---");
        if (neDon(dragonAgi)) {
            await hieuUng("hero", "ne", 0);
            hienThi("Rồng đã né đòn của bạn!");
        } else {
            var satThuongHero = strength;
            // Theo đề bài: xác suất ngẫu nhiên lớn hơn intel thì chí mạng.
            if (Math.random() * 100 > intel) {
                satThuongHero += strength * 2;
                hienThi("Anh hùng đánh chí mạng!");
            }
            await hieuUng("hero", "trung", satThuongHero);
            dragonHealth = tinhMauConLai(dragonHealth, satThuongHero);
            capNhatMau();
            hienThi("Anh hùng gây " + satThuongHero + " sát thương. Máu Rồng: " + dragonHealth);
        }
        if (dragonHealth <= 0) {
            gameContinue = false;
            phatAm("thang");
            document.getElementById("trang-thai").textContent = "Chiến thắng! Bạn đã trở thành Dũng sĩ diệt Rồng.";
            hienThi("CHIẾN THẮNG! Bạn nhận danh hiệu Dũng sĩ diệt Rồng!");
            level = 6;
            xp += 600;
            hienThi("LEVEL UP! Cấp " + level + " | XP: " + xp);
        } else if (neDon(agility)) {
            await hieuUng("dragon", "ne", 0);
            hienThi("Anh hùng đã né đòn của Rồng!");
        } else {
            var satThuongRong = dragonStr;
            if (Math.random() * 100 > dragonInt) {
                satThuongRong += dragonStr * 2;
                hienThi("Rồng đánh chí mạng!");
            }
            await hieuUng("dragon", "trung", satThuongRong);
            health = tinhMauConLai(health, satThuongRong);
            hienThi("Rồng gây " + satThuongRong + " sát thương. Máu anh hùng: " + health);
            if (health <= 0) {
                gameContinue = false;
                document.getElementById("trang-thai").textContent = "Bạn đã thất bại. Hãy thử lại và chinh phục Rồng Già!";
                hienThi("THẤT BẠI! Hãy nhấn nút để thử lại.");
            }
        }
        capNhatMau();
        luot++;
        if (gameContinue) nutTanCong.disabled = false;
    }
    nutTanCong.disabled = true;
    nutBatDau.disabled = false;
    nutBatDau.textContent = "Chơi lại";
    nutTraLoi.disabled = false;
    hienThi("Nhấn Trả lời 3 câu hỏi để làm Bài tập 9, hoặc nhấn Chơi lại.");

    // BÀI TẬP 8: Tạo đối tượng AnhHung từ các thông tin đã có.
    var AnhHung = {
        ten: ten,
        phanLop: phancap,
        level: level,
        xp: xp,
        health: health,
        strength: strength,
        agility: agility,
        intel: intel,
        di: function () { return this.ten + " đang đi."; },
        chay: function () { return this.ten + " đang chạy."; },
        nhay: function () { return this.ten + " đang nhảy."; },
        ngu: function () { return this.ten + " đang ngủ."; }
    };
    if (dragonHealth <= 0) {
        AnhHung.level = 8;
        AnhHung.xp += 700 + 800;
        hienThi("Hoàn thành Quest 6 và 7: cấp " + AnhHung.level + " | XP: " + AnhHung.xp);
    }
    document.getElementById("stat-level").textContent = AnhHung.level;
    document.getElementById("stat-xp").textContent = AnhHung.xp + " XP";
    hienThi("Thông tin Anh Hùng: " + AnhHung.ten + " – " + AnhHung.phanLop + " – cấp " + AnhHung.level);
    hienThi(AnhHung.di());

}

// BÀI TẬP 9: Hỏi 3 câu, lưu câu trả lời vào mảng rồi in ra HTML.
function traLoiCauHoi() {
    document.getElementById("tra-loi").disabled = true;
    var mangCauHoi = [
        "Bạn có người yêu chưa?",
        "Bạn có thích ăn rau dền không?",
        "Người yêu bạn có thích ăn rau dền không?"
    ];
    var mangCauTraLoi = [];
    for (var i = 0; i < mangCauHoi.length; i++) {
        var cauTraLoi = prompt(mangCauHoi[i]);
        mangCauTraLoi.push(cauTraLoi === null ? "Không trả lời" : cauTraLoi);
    }
    hienThi("CÂU TRẢ LỜI CỦA BẠN:");
    for (var j = 0; j < mangCauTraLoi.length; j++) {
        hienThi(mangCauHoi[j] + " " + mangCauTraLoi[j]);
    }
}

document.getElementById("bat-dau").addEventListener("click", batDauHanhTrinh);
document.getElementById("tra-loi").addEventListener("click", traLoiCauHoi);