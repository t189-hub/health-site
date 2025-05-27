document.addEventListener('DOMContentLoaded', function() {
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
    const refundPerMeal = 65; // 每餐退費金額

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

    // 提交表單處理
    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // 阻止表單預設提交行為

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

        // *** 重要：請替換為您從 Google Apps Script 獲取的 Web App URL ***
        // 範例 URL: https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/exec
        const webAppUrl = 'https://script.google.com/macros/s/AKfycbzt5DhNSOnQogkqjtE7EHfcXD1mrpIPx4TspXyJwTdpMGJyeFjBei1KH1zd0wyCXHYQ2w/exec'; 

        try {
            const response = await fetch(webAppUrl, {
                method: 'POST',
                // mode: 'no-cors' 是解決跨域問題的常見方法，
                // 但這會導致 fetch 的 response 成為 opaque，
                // 意味著你無法在前端檢查 response.ok 或解析 response.json()。
                // 對於簡單的資料提交，這通常是可接受的。
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData) // 將資料轉換為 JSON 字符串發送
            });

            // 由於使用了 'no-cors' 模式，這裡無法直接檢查 response.ok 或解析 JSON
            // 我們假設請求成功發送就表示資料已送達 Apps Script
            alert('退費申請已成功提交！');
            form.reset(); // 清空表單
            calculateRefund(); // 重新計算，確保初始值正確

        } catch (error) {
            console.error('提交失敗:', error);
            alert('提交失敗，請檢查網路連線或稍後再試。');
        } finally {
            submitBtn.disabled = false; // 恢復按鈕狀態
            submitBtn.textContent = '提交申請';
        }
    });

    // 列印按鈕處理
    printBtn.addEventListener('click', function() {
        window.print();
    });
});
