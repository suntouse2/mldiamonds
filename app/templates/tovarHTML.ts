import getSupport from "@/services/supportService";
import { Order, Product } from "@prisma/client";

export async function tovarHTML(order: Order) {
  const support = await getSupport();
  const product = order.productSnapshot as object as Product;
  const data = product.data as { amount: number; title: string };

  return `<!DOCTYPE html>
  <html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Заказ — Письмо</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f3f7fb;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        color: #222;
      }
      .wrapper { width: 100%; table-layout: fixed; background-color: #f3f7fb; padding: 24px 0; }
      .main { background: #fff; max-width: 600px; margin: 0 auto; border-radius: 6px; overflow: hidden; }
      .header { background: #eaf4ff; text-align: center; padding: 18px 20px; color: #1b3b66; font-weight: 600; }
      .content { padding: 22px; }
      .title { color: #7b0f86; font-size: 20px; font-weight: 700; margin: 0 0 8px; }
      .sub { color: #555; font-size: 14px; line-height: 1.45; margin: 0 0 18px; }
      .win-box {
        background: linear-gradient(180deg, #3f9bff 0%, #2e78d6 100%);
        border-radius: 8px;
        padding: 18px;
        color: #fff;
        text-align: left;
        margin-bottom: 18px;
      }
      .win-desc { font-size: 13px; opacity: 0.95; margin: 0 0 12px; }
      .code {
        display: inline-block;
        background: rgba(255, 255, 255, 0.12);
        padding: 10px 14px;
        border-radius: 6px;
        font-weight: 700;
        letter-spacing: 1px;
        font-family: monospace;
      }
      .faq {
        background: #111217;
        color: #d6d6d6;
        padding: 22px;
        border-radius: 6px;
        font-size: 13px;
        line-height: 1.5;
      }
      .faq h4 { color: #fff; margin: 0 0 8px; font-size: 14px; }
      .faq p { margin: 0 0 12px; }
      .footer {
        padding: 14px 22px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
      a { color: #1a73e8; text-decoration: none; }
      @media screen and (max-width: 420px) {
        .content { padding: 16px; }
        .header { padding: 14px; }
        .win-box { padding: 14px; }
      }
    </style>
  </head>
  <body>
    <table role="presentation" class="wrapper" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" class="main" width="600" cellpadding="0" cellspacing="0">
            <tr>
              <td class="header">
                Заказ №${order.id} на MLDonat
              </td>
            </tr>

            <tr>
              <td class="content" style="background: #ffffff">
                <h1 class="title">
                  Ваш заказ №${order.id} успешно оформлен 🎉
                </h1>

                <p class="sub">
                  Спасибо, что выбрали MLDonat!<br />
                  Доставка товара выполняется в течение 15 минут — 12 часов.
                </p>

                <div class="win-box">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" valign="middle" width="38" height="38" style="background: rgba(255,255,255,0.12); border-radius:50%;">
                        🎁
                      </td>
                      <td style="padding-left:8px; font-weight:700;">${
                        product.title
                      }</td>
                    </tr>
                  </table>

                  <p class="win-desc">
                   Товар успешно куплен!
                  </p>

                  <div style="text-align: center; margin-top: 6px">
                    <span class="code">${data.title}</span>
                  </div>
                </div>

                <div class="faq">
                  <h4>Информация о заказе</h4>

                  <p><strong>Товар:</strong> ${product.title}</p>
                  <p><strong>Количество:</strong> ${data.amount ?? 1}</p>
                  <p><strong>Цена:</strong> ${product.price} ₽</p>
                  <p><strong>Статус:</strong> в обработке</p>


                  <h4>Если возникли вопросы</h4>
                  <p>
                    Обратитесь в нашу службу поддержки — мы быстро поможем вам решить любой вопрос, связанный с оплатой или доставкой.
                  </p>

                  <p style="margin: 12px 0 0; color: #9aa0a6; font-size: 12px">
                    Это письмо сформировано автоматически. Пожалуйста, не отвечайте на него — ответы не обрабатываются.
                  </p>
                </div>
              </td>
            </tr>

            <tr>
              <td class="footer" style="background: #ffffff;">
                <a href=="${support}">Поддержка</a> |
                <a href="https://http://MLDonat.shop/user-agreement">Пользовательское соглашение</a><br />
                DONATHUB © 2024 — 2025
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
