export default function (verificationCode: string, recipient: string) {
  return {
    from: '"DREAMERCODES SCHOOL" <dreamercodes.school@gmail.com>',
    to: recipient,
    subject: "Password reset",
    text: `Your password reset verification code is ${verificationCode}`,
    html: `
              <div>
                <p>Use the code <span style={{font-weight:"bold", font-size:"21px"}} >${verificationCode}</span> to reset your password </p>
                </br>
                <p>Once verified, you will be able to reset your password</p>
                </br/>
                <p><b>Do not share this email.</b></p>
                <br/>
                <em><small> This email was intended for ${recipient} ,if you didn't request password reset on Dreamercodes School, please ignore this email</small></em>
              </div>
       `,
  };
}
