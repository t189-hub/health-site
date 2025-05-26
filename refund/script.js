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
    document.addEventListener('DOMContentLoaded', function() {
    // ... (其他現有程式碼) ...

    const form = document.getElementById('refundForm');
    // ... (其他現有元素獲取) ...

    // ... (calculateRefund 函數及相關監聽器) ...

    // 提交表單處理
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表單預設提交行為，因為我們要用 Fetch API 提交

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true; // 提交時禁用按鈕，避免重複提交
        submitBtn.textContent = '提交中...'; // 更改按鈕文字

        // 收集所有表單資料
        const formData = {
            classNum: document.getElementById('classNum').value,
            gradeNum: document.getElementById('gradeNum').value,
            studentNum: document.getElementById('studentNum').value,
            studentName: document.getElementById('studentName').value,
            personCount: document.getElementById('personCount').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            mealCount: document.getElementById('mealCount').value, // 這是計算出的天數
            reason: document.getElementById('reason').value,
            finalRefundAmount: document.getElementById('finalRefundAmount').value,
            applicationDate: document.getElementById('applicationDate').value
        };

        // **替換為您從 Google Apps Script 獲取的 Web App URL**
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbwibLTDqs4kUj6cMTzqAhPDBvfafi3Sl7Xa-3bfoYe466pGgQJ0loLOB_KpSSiUBOZtIw/exec'; // <-- 重要：請替換這個 URL

        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // 這是解決 CORS 問題的關鍵，但會使 fetch 的 response 成為 opaque
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData) // 將資料轉換為 JSON 字符串發送
        })
        .then(response => {
            // 因為 mode: 'no-cors'，response.ok 和 response.json() 會不可用
            // 但如果請求成功發送，Apps Script 通常會成功處理。
            // 為了用戶體驗，我們假設請求發送後就成功了。
            alert('退費申請已成功提交！');
            form.reset(); // 清空表單
            calculateRefund(); // 重新計算，確保初始值正確
        })
        .catch(error => {
            console.error('提交失敗:', error);
            alert('提交失敗，請稍後再試。');
        })
        .finally(() => {
            submitBtn.disabled = false; // 恢復按鈕狀態
            submitBtn.textContent = '提交申請';
        });
    });

    // ... (列印按鈕處理) ...

});

    // 列印按鈕處理
    printBtn.addEventListener('click', function() {
        window.print();
    });
});
