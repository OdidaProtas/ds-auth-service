export default function (verificationCode:string, recipient:string) {
  return {
    from: '"DREAMERCODES SCHOOL" <dreamercodes.school@gmail.com>',
    to: recipient,
    subject: "Verification code",
    text: `Your verification code is ${verificationCode}`,
    html: `
            <div>
              <p>Your verification code is <span style={{font-weight:"bold", font-size:"21px"}} >${verificationCode}</span> </p>
              </br>
              <p>Verify your account and get started learning for free</p>
              </br/>
              <p><b>Do not share this email.</b></p>
              <br/>
              <em><small> This email was intended for ${recipient} ,if you didn't sign up on Dreamercodes School, please ignore this email</small></em>
            </div>
     `,
  };
}
