import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "@/backend/Auth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 120;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [message, setMessage] = useState(
    "Enter the email associated with your account.",
  );
  const [otpError, setOtpError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!emailSubmitted || countdown === 0) return undefined;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [emailSubmitted, countdown]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleEmailSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setOtpError("Please enter a valid email address.");
        return;
      }
      await Auth.forgetPasswordReq({ email });
      setOtpError("");
      setOtp(Array(OTP_LENGTH).fill(""));
      setCountdown(RESEND_SECONDS);
      setEmailSubmitted(true);
      setMessage(
        "We’ve sent a 6-digit verification code to your email address.",
      );
    } catch (error) {
      console.error("Error sending verification code:", error);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);
    setOtpError("");

    if (value && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      console.log(otp);
      const enteredCode = otp.join("");

      if (enteredCode.length !== OTP_LENGTH) {
        setOtpError("Please enter the complete 6-digit verification code.");
        return;
      }

      if (countdown === 0) {
        setOtpError(
          "This verification code has expired. Please request a new one.",
        );
        return;
      }

      setIsLoading(true);
      setOtpError("");

      const res = await Auth.forgetPassword({
        email,
        resetToken: enteredCode,
        newPassword: password,
      });
      console.log(res);

      setIsLoading(false);
      setMessage("OTP verified successfully.");
      //   navigate("/reset-password");
    } catch (e) {
      console.log(e);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    await Auth.forgetPasswordReq({ email });
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setCountdown(RESEND_SECONDS);
    setMessage("We’ve sent a 6-digit verification code to your email address.");
    focusInput(0);
  };

  const handleChangeEmail = () => {
    setEmailSubmitted(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setCountdown(RESEND_SECONDS);
    setMessage("Enter the email associated with your account.");
  };

  return (
    <div className="min-h-screen bg-[#090909] px-4 py-10 text-white flex items-center justify-center">
      <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-[#101010] p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          ← Back to login
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
            Password recovery
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-white">
            Forgot password
          </h1>
        </div>

        {!emailSubmitted ? (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                type="text"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setOtpError("");
                }}
                placeholder="you@example.com"
                className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/20 focus:ring-2 focus:ring-white/10"
              />
            </div>

            {otpError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {otpError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100"
            >
              Send verification code
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0b0b0b] p-4">
              <p className="text-sm text-slate-300">{message}</p>
              <p className="mt-2 text-sm text-slate-400">
                If an account exists for this email, we’ve sent a verification
                code.
              </p>
              <div className="mt-3 text-sm font-medium text-white">{email}</div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-300">
                Enter 6-digit OTP
              </label>
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    className="h-12 w-12 rounded-2xl border border-white/10 bg-[#0b0b0b] text-center text-lg font-semibold text-white outline-none transition focus:border-white/25 focus:ring-2 focus:ring-white/10 sm:h-14 sm:w-14"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Enter a new password"
                  className="w-full rounded-3xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/20 focus:ring-2 focus:ring-white/10"
                />
              </div>
            </div>

            {otpError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {otpError}
              </div>
            )}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full rounded-3xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0}
                className="text-sm font-medium text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
              </button>

              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Change Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
