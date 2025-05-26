script.jsdocument.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('refundForm');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const daysCountSpan = document.getElementById('daysCount');
    const personCountInput = document.getElementById('personCount');
    const displayPersonCountSpan = document.getElementById('displayPersonCount');
    const displayMealCountSpan = document.getElementById('displayMealCount');
    const mealCountInput = document.getElementById('mealCount');
    const totalRefundAmountSpan = document.getElementById('totalRefundAmount');
    const finalRefundAmountInput = document.getElementById('finalRefundAmount');
    const applicationDateInput = document.getElementById('applicationDate');
    const printBtn = document.getElementById('printBtn');
    const refundPerMeal = 65; // 每餐退費金額 [cite: 1, 2, 3]

    // 設定申請日期預設為今日
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // 月份從0開始
    const dd = String(today.getDate()).padStart(2, '0');
    applicationDateInput.value = `${yyyy}-${mm}-${dd}`;

    function calculateRefund() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        let days = 0;

        if (startDateInput.value && endDateInput.value && startDate <= endDate) {
            // 計算天數 (包含頭尾)
            const diffTime = Math.abs(endDate - startDate);
            days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // 排除週末，假設週六日不供餐
            let weekdays = 0;
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
                if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 如果不是週日或週六
                    weekdays++;
                }
            }
            days = weekdays; // 退費天數只算平日
        }

        const personCount = parseInt(personCountInput.value) || 0;
        const totalMeals = days * personCount;
        const totalAmount = totalMeals * refundPerMeal;

        daysCountSpan.textContent = days;
        displayMealCountSpan.textContent = days; // 顯示餐數為天數
        mealCountInput.value = days; // 將天數存入隱藏欄位

        displayPersonCountSpan.textContent = personCount;
        totalRefundAmountSpan.textContent = `$ ${totalAmount}`;
        finalRefundAmountInput.value = totalAmount;
    }

    // 監聽日期和人數變化
    startDateInput.addEventListener('change', calculateRefund);
    endDateInput.addEventListener('change', calculateRefund);
    personCountInput.addEventListener('input', calculateRefund);

    // 初始計算
    calculateRefund();

    // 提交表單處理 (這裡只做簡單的提示，實際應用會發送到後端)
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表單預設提交行為
        alert('退費申請已提交！(此為模擬提交，實際應用需後端處理資料)');
        // 在實際應用中，您會在這裡發送資料到伺服器
        // 例如：fetch('/api/submit-refund', { method: 'POST', body: new FormData(form) })
    });

    // 列印按鈕處理
    printBtn.addEventListener('click', function() {
        window.print();
    });
});
