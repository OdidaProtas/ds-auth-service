export default function (recipient: string) {
  return {
    from: '"DREAMERCODES SCHOOL" <dreamercodes.school@gmail.com>',
    to: recipient,
    subject: "Security alert - Password reset",
    text: `Your password has been reset`,
    html: `
                <div>
                  <p>Your password reset request has been successful.</p>
                  </br>
                  <p>If you did not make the password request, please change your password on https://dreamercodes.web.app to secure your account</p>
                  </br/>
                  <p><b>Do not share this email.</b></p>
                  <br/>
                  <em><small> This email was intended for ${recipient} ,if you didn't request password reset on Dreamercodes School, please ignore this email</small></em>
                </div>
         `,
  };
}
