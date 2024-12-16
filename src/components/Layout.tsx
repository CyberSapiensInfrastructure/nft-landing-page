import React, { useEffect, useState } from "react";
import ConnectButton from "./ConnectButton";
import { useDispatch } from "react-redux";
import { ethers, providers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers5/react";
import {
  resetProvider,
  setProvider,
  setSigner,
} from "../app/slices/walletProvider";
import StackedNotifications from "./Notification";
import ShuffleLoader from "./Loader";
import CountdownTimer from "./CountdownTimer";
import Modal from "./Modal";
import Button from "./Button";
import StepperProgress from "./StepperProgress";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

const BackgroundCompiler = React.lazy(
  () => import("../components/BackgroundCompiler")
);

const DisconnectedMessage = React.memo(() => (
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <div className="text-center px-6 py-16 w-full backdrop-blur-sm border-y border-[#7042f88b]/5">
      <div className="max-w-md mx-auto space-y-2 uppercase">
        <p className="text-2xl font-light tracking-tight">
          <span className="animate-pulse inline-block bg-gradient-to-r from-[#7042f88b] to-[#9f7aea] bg-clip-text text-transparent">
            Connect Wallet
          </span>
        </p>
        <p className="text-white/40 text-xs">to access providence</p>
      </div>
    </div>
  </div>
));

const DecoElements = React.memo(() => (
  <>
    {/* Noise overlay */}
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-soft-light">
      <div className="absolute inset-0 bg-noise animate-noise" />
    </div>

    {/* Particle grid */}
    <div className="fixed inset-0 z-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#7042f88b]/20 rounded-full animate-particle"
          style={{
            left: `${Math.random() * 100}vw`,
            top: `${Math.random() * 100}vh`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${20 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>

    {/* Cyber circles */}
    <div className="fixed left-10 top-40 opacity-30 pointer-events-none z-0">
      <div className="relative w-64 h-64">
        <div className="absolute inset-0 border border-[#7042f88b]/20 rounded-full animate-spin-slow" />
        <div className="absolute inset-2 border border-[#7042f88b]/10 rounded-full animate-spin-reverse" />
        <div className="absolute inset-4 border border-[#7042f88b]/5 rounded-full animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#7042f88b]/40 rounded-full animate-pulse" />
        </div>
      </div>
    </div>

    {/* Energy beams */}
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="fixed opacity-20 pointer-events-none overflow-hidden"
        style={{
          left: `${30 + i * 30}%`,
          top: "20%",
          transform: "rotate(45deg)",
        }}
      >
        <div
          className="w-[1px] h-[200px] bg-gradient-to-b from-transparent via-[#7042f88b] to-transparent animate-energy-beam"
          style={{ animationDelay: `${i * 2}s` }}
        />
      </div>
    ))}
  </>
));

const Layout: React.FC = () => {
  const { walletProvider } = useWeb3ModalProvider();
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [formInputs, setFormInputs] = useState({
    twitter: "",
    email: "",
  });
  const dispatch = useDispatch();
  const [isCopied, setIsCopied] = useState(false);
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [twitterStep, setTwitterStep] = useState<
    "connect" | "verify" | "completed"
  >("connect");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [isQuestsOpen, setIsQuestsOpen] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [twitterData, setTwitterData] = useState<{
    access_token?: string;
    user_id?: string;
    following?: boolean;
  }>({});

  const [testModal, setTestModal] = useState<{
    show: boolean;
    title: string;
    data: any;
  }>({
    show: false,
    title: "",
    data: null,
  });

  const [isLikeVerified, setIsLikeVerified] = useState(false);


  // Follow state'i ekle
  const [isVerifyingFollow, setIsVerifyingFollow] = useState(false);



  // State'lere ekle
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [emailMarketingAccepted, setEmailMarketingAccepted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email validasyon fonksiyonu
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };



  useEffect(() => {
    const handleDisconnect = () => {
      dispatch(resetProvider());
      setWalletAddress("");
      setFormInputs({
        twitter: "",
        email: "",
      });
    };

    if (walletProvider) {
      const web3Provider = new ethers.providers.Web3Provider(
        walletProvider as providers.ExternalProvider
      );
      dispatch(setProvider(web3Provider));
      const signer = web3Provider.getSigner();
      dispatch(setSigner(signer));

      if ("on" in walletProvider && "removeListener" in walletProvider) {
        (walletProvider as any).on("disconnect", handleDisconnect);
        return () => {
          (walletProvider as any).removeListener(
            "disconnect",
            handleDisconnect
          );
        };
      }
    } else {
      handleDisconnect();
    }
  }, [walletProvider, dispatch]);

  useEffect(() => {
    const getAddress = async () => {
      if (walletProvider) {
        const web3Provider = new ethers.providers.Web3Provider(
          walletProvider as providers.ExternalProvider
        );
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
      }
    };
    getAddress();
  }, [walletProvider]);

  const handleInputChange =
    (field: keyof typeof formInputs) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormInputs((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (field === "email") {
        setIsEmailValid(validateEmail(value));
      }
    };

  // Örnek tarih - bunu istediğiniz tarihe ayarlayabilirsiniz
  const questEndDate = new Date("2024-12-31T23:59:59");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const storedState = localStorage.getItem("twitter_oauth_state");

    if (code) {
      if (state !== storedState) {
        console.error("State mismatch");
        return;
      }

      localStorage.removeItem("twitter_oauth_state");

      const backendUrl = `http://localhost:3001/twitter/callback?code=${code}`;

      fetch(backendUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setFormInputs((prev) => ({
              ...prev,
              twitter: data.user.data.username,
            }));
            setTwitterStep("completed");
            setTwitterData({
              access_token: data.access_token,
              user_id: data.user.data.id,
            });
          } else {
            throw new Error(data.error);
          }
        })
        .catch((error) => {
          console.error("Twitter verification failed:", error);
          setTwitterStep("connect");
        });

      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleConnectTwitter = () => {
    setIsConnectingTwitter(true);
    try {
      const state = Math.random().toString(36).substring(7);
      const code_verifier = "challenge";

      const params = new URLSearchParams({
        response_type: "code",
        client_id: "QmJmOUF1SWtnSzNWNnRObUM1QUc6MTpjaQ",
        redirect_uri: "http://localhost:5173",
        scope: "tweet.read users.read follows.read offline.access",
        state: state,
        code_challenge: code_verifier,
        code_challenge_method: "plain",
      });

      localStorage.setItem("twitter_oauth_state", state);
      localStorage.setItem("twitter_code_verifier", code_verifier);

      const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

      // 30 saniye timeout ekle
      setTimeout(() => {
        if (isConnectingTwitter) {
          setIsConnectingTwitter(false);
          setNotification({
            show: true,
            message: "Twitter connection timed out. Please try again.",
            type: "error",
          });
        }
      }, 30000);

      window.location.href = authUrl;
    } catch (error) {
      console.error("Error connecting Twitter:", error);
      setIsConnectingTwitter(false);
    }
  };

  const handleLikeCheck = async () => {
    try {
      setError(null);
      console.log("Checking like status...");
      const response = await fetch(
        `http://localhost:3001/twitter/check-like?user_id=${twitterData.user_id}&tweet_id=${LIKE_TWEET_ID}&access_token=${twitterData.access_token}`
      );
      const data = await response.json();

      if (response.status === 403) {
        setError("Please make sure you've liked the tweet and try again.");
        return;
      }

      if (data.success) {
        setIsLikeVerified(data.isLiked);
        if (!data.isLiked) {
          setNotification({
            show: true,
            message: "Please like the tweet first and try again.",
            type: "error",
          });
        }
      } else {
        throw new Error(data.error || "Failed to verify like");
      }
    } catch (error) {
      console.error("Like check failed:", error);
      setNotification({
        show: true,
        message: error instanceof Error ? error.message : "Failed to verify like",
        type: "error",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!walletAddress || !disclaimerAccepted) {
        setNotification({
          show: true,
          message: "Please connect your wallet and accept the terms",
          type: "error",
        });
        return;
      }

      // Email kontrolü - Eğer email girilmiş ama valid değilse veya consent yoksa email'i göndermeyeceğiz
      const emailToSend =
        isEmailValid && emailMarketingAccepted ? formInputs.email : "undefined";

      // URL'yi oluştur
      const url = new URL("https://providencequest-2mc5433laq-uc.a.run.app/");

      // Zorunlu parametre
      url.searchParams.append("wa", walletAddress);

      // Opsiyonel parametreler - undefined veya false olarak gönder
      url.searchParams.append("tid", twitterData.user_id || "undefined");
      url.searchParams.append("tus", formInputs.twitter || "undefined");
      url.searchParams.append("mcd", LIKE_TWEET_ID || "undefined");
      url.searchParams.append("atf", "PlayProvidence");
      url.searchParams.append("ttl", LIKE_TWEET_ID || "undefined");
      url.searchParams.append(
        "flw",
        (twitterData.following || false).toString()
      );
      url.searchParams.append("lke", (isLikeVerified || false).toString());
      url.searchParams.append("eml", emailToSend);

      // CORS proxy kullan
      const corsProxy = "https://api.allorigins.win/get?url=";
      const finalUrl = corsProxy + encodeURIComponent(url.toString());

      const response = await fetch(finalUrl);
      const rawData = await response.json();

      if (rawData.status.http_code === 200) {
        setIsSubmitted(true);
        setNotification({
          show: true,
          message: "Quest completed successfully! Thank you for participating.",
          type: "success",
        });
      } else {
        throw new Error(rawData.contents || "Submission failed");
      }
    } catch (error) {
      console.error("Submit failed:", error);
      setNotification({
        show: true,
        message: `Failed to submit quest: ${(error as Error).message}`,
        type: "error",
      });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setTwitterStep("connect");
    setFormInputs({
      twitter: "",
      email: "",
    });
    setNotification(null);
    setIsLikeVerified(false);
    setTwitterData({});
    setIsQuestsOpen(true);
    setError(null);
  };

  // Twitter Actions Container
  const renderTwitterActions = () => (
    <div className="space-y-4 p-6 bg-[#0c0c0c] border border-[#7042f88b]/20 rounded-lg">
      {/* Container Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-[#7042f88b]/20">
        <div className="w-2 h-2 bg-[#d8624b]" />
        <h2 className="text-sm font-medium tracking-wider text-white/90 uppercase">
          Twitter Actions
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d8624b]/20 to-transparent" />
      </div>

      {/* Follow Check Button */}
      <div className="space-y-2">
        <button
          onClick={handleFollowVerification}
          disabled={twitterData.following || isVerifyingFollow}
          className={`w-full px-4 py-2.5 sm:py-3 text-sm border rounded-lg transition-all duration-300 tracking-wider font-light flex items-center justify-center gap-2
            ${
              twitterData.following
                ? "bg-[#d8624b]/20 border-[#d8624b] text-[#d8624b] cursor-not-allowed"
                : "bg-[#d8624b]/10 hover:bg-[#d8624b]/20 border-[#d8624b]/20 text-white"
            }
          `}
        >
          {isVerifyingFollow ? (
            <>
              <div className="w-4 h-4 border-2 border-[#d8624b] border-t-transparent rounded-full animate-spin" />
              Verifying...
            </>
          ) : twitterData.following ? (
            "Following ✓"
          ) : (
            "Verify Follow"
          )}
        </button>
      </div>

      {/* Like Check Button */}
      <div className="space-y-2">
        <button
          onClick={handleLikeCheck}
          disabled={isLikeVerified}
          className={`w-full px-4 py-2.5 sm:py-3 text-sm border rounded-lg transition-all duration-300 tracking-wider font-light flex items-center justify-center gap-2
            ${
              isLikeVerified
                ? "bg-[#d8624b]/20 border-[#d8624b] text-[#d8624b] cursor-not-allowed"
                : "bg-[#d8624b]/10 hover:bg-[#d8624b]/20 border-[#d8624b]/20 text-white"
            }
          `}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill={isLikeVerified ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          {isLikeVerified ? "Like Verified" : "Verify Like"}
        </button>

        {/* Hata mesajı */}
        {!isLikeVerified && error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}
      </div>

      {/* Email Input - Like verify edildikten sonra göster */}
      {isLikeVerified && (
        <div className="space-y-4 animate-fadeIn">
          <div className="space-y-2">
            <div className="text-xs text-white/60 mb-2">
              Enter your email to complete the quest
            </div>
            <div className="relative">
              <input
                type="email"
                value={formInputs.email}
                onChange={handleInputChange("email")}
                disabled={isSubmitted}
                className={`w-full bg-transparent py-2 sm:py-3 px-4 text-sm sm:text-base font-light tracking-wider focus:outline-none text-white/80 placeholder:text-white/20 border ${
                  formInputs.email && !isEmailValid 
                    ? "border-red-500/50" 
                    : "border-[#d8624b]/20"
                } rounded-lg ${
                  isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="Enter your email"
              />
              {formInputs.email && !isEmailValid && (
                <div className="text-xs text-red-500 mt-1">
                  Please enter a valid email address
                </div>
              )}
            </div>
          </div>

          {formInputs.email && isEmailValid && (
            <label className="flex items-start gap-3 p-4 rounded-lg bg-black/20 backdrop-blur-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={emailMarketingAccepted}
                onChange={(e) => setEmailMarketingAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 border-2 border-[#d8624b]/20 rounded-none bg-transparent checked:bg-[#d8624b] appearance-none cursor-pointer transition-all duration-300"
              />
              <div className="space-y-1">
                <div className="text-xs text-white/90">
                  Email Marketing Consent
                </div>
                <div className="text-[11px] text-white/60 leading-relaxed">
                  I agree to receive marketing communications from Providence.
                  You can unsubscribe at any time.
                </div>
              </div>
            </label>
          )}
        </div>
      )}
    </div>
  );

  const renderFormContent = () => (
    <div className="space-y-8">
      {/* Twitter Connect Container */}
      <div className="space-y-4 p-6 bg-[#0c0c0c] border border-[#7042f88b]/20 rounded-lg">
        {/* Container Title */}
        <div className="flex items-center gap-2 pb-4 border-b border-[#7042f88b]/20">
          <div className="w-2 h-2 bg-[#d8624b]" />
          <h2 className="text-sm font-medium tracking-wider text-white/90 uppercase">
            Twitter
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d8624b]/20 to-transparent" />
        </div>

        {/* Twitter Connect Button */}
        {twitterStep === "connect" && (
          <button
            onClick={handleConnectTwitter}
            disabled={isConnectingTwitter || !walletProvider}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base bg-[#d8624b]/10 hover:bg-[#d8624b]/20 backdrop-blur-sm border border-[#d8624b]/20 rounded-lg transition-all duration-300 tracking-wider font-light text-white/90 hover:text-white hover:border-[#d8624b]/40"
          >
            {isConnectingTwitter ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-[#d8624b] border-t-transparent rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              "Connect Twitter"
            )}
          </button>
        )}

        {/* Twitter Account Display when completed */}
        {twitterStep === "completed" && (
          <div className="w-full space-y-4">
            {/* Twitter Account Display */}
            <div className="bg-[#d8624b]/15 border border-[#d8624b]/20 rounded-lg px-4 py-3 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-white/40 block">
                    Twitter Account
                  </span>
                  <div className="font-mono text-sm sm:text-base text-white/70 tracking-wider">
                    @{formInputs.twitter}
                  </div>
                </div>
                <span className="text-[10px] text-[#d8624b] self-end sm:self-center">
                  Verified ✓
                </span>
              </div>
            </div>

            {/* Test Likes Button - Sadece development'ta göster */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={testLikes}
                className="w-full px-4 py-2.5 sm:py-3 text-sm border rounded-lg transition-all duration-300 tracking-wider font-light flex items-center justify-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 text-white"
              >
                Test Likes
              </button>
            )}

            {/* Follow Check Button */}
            <div className="space-y-2">
              <button
                onClick={handleFollowVerification}
                disabled={twitterData.following || isVerifyingFollow}
                className={`w-full px-4 py-2.5 sm:py-3 text-sm border rounded-lg transition-all duration-300 tracking-wider font-light flex items-center justify-center gap-2
                  ${
                    twitterData.following
                      ? "bg-[#d8624b]/20 border-[#d8624b] text-[#d8624b] cursor-not-allowed"
                      : "bg-[#d8624b]/10 hover:bg-[#d8624b]/20 border-[#d8624b]/20 text-white"
                  }
                `}
              >
                {isVerifyingFollow ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#d8624b] border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : twitterData.following ? (
                  "Following ✓"
                ) : (
                  "Verify Follow"
                )}
              </button>
            </div>

            {/* Like Check Button */}
            <div className="space-y-2">
              <button
                onClick={handleLikeCheck}
                disabled={isLikeVerified}
                className={`w-full px-4 py-2.5 sm:py-3 text-sm border rounded-lg transition-all duration-300 tracking-wider font-light flex items-center justify-center gap-2
                  ${
                    isLikeVerified
                      ? "bg-[#d8624b]/20 border-[#d8624b] text-[#d8624b] cursor-not-allowed"
                      : "bg-[#d8624b]/10 hover:bg-[#d8624b]/20 border-[#d8624b]/20 text-white"
                  }
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill={isLikeVerified ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isLikeVerified ? "Like Verified" : "Verify Like"}
              </button>

              {/* Hata mesajı */}
              {!isLikeVerified && error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </div>

            {/* Email Input - Like verify edildikten sonra göster */}
            {isLikeVerified && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <div className="text-xs text-white/60 mb-2">
                    Enter your email to complete the quest
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      value={formInputs.email}
                      onChange={handleInputChange("email")}
                      disabled={isSubmitted}
                      className={`w-full bg-transparent py-2 sm:py-3 px-4 text-sm sm:text-base font-light tracking-wider focus:outline-none text-white/80 placeholder:text-white/20 border ${
                        formInputs.email && !isEmailValid 
                          ? "border-red-500/50" 
                          : "border-[#d8624b]/20"
                      } rounded-lg ${
                        isSubmitted ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      placeholder="Enter your email"
                    />
                    {formInputs.email && !isEmailValid && (
                      <div className="text-xs text-red-500 mt-1">
                        Please enter a valid email address
                      </div>
                    )}
                  </div>
                </div>

                {formInputs.email && isEmailValid && (
                  <label className="flex items-start gap-3 p-4 rounded-lg bg-black/20 backdrop-blur-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={emailMarketingAccepted}
                      onChange={(e) => setEmailMarketingAccepted(e.target.checked)}
                      className="mt-1 w-4 h-4 border-2 border-[#d8624b]/20 rounded-none bg-transparent checked:bg-[#d8624b] appearance-none cursor-pointer transition-all duration-300"
                    />
                    <div className="space-y-1">
                      <div className="text-xs text-white/90">
                        Email Marketing Consent
                      </div>
                      <div className="text-[11px] text-white/60 leading-relaxed">
                        I agree to receive marketing communications from Providence.
                        You can unsubscribe at any time.
                      </div>
                    </div>
                  </label>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderQuests = () => (
    <div className="space-y-4 p-6 bg-[#0c0c0c] border border-[#7042f88b]/20 rounded-lg relative z-10">
      {/* Quest Title */}
      <div
        onClick={() => setIsQuestsOpen((prev) => !prev)}
        className="flex items-center gap-2 pb-4 border-b border-[#7042f88b]/20 cursor-pointer group relative z-20"
      >
        <div className="w-2 h-2 bg-[#d8624b]" />
        <h2 className="text-sm font-medium tracking-wider text-white/90 uppercase">
          Quests
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d8624b]/20 to-transparent" />
        <div
          className={`transition-transform duration-300 ${
            isQuestsOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-[#d8624b] group-hover:text-[#9f7aea]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Quest Items */}
      <div
        className={`space-y-4 transition-all duration-300 overflow-hidden relative ${
          isQuestsOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-4">
          {/* Connect Wallet Quest */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
              walletAddress
                ? "bg-[#d8624b]/5 line-through opacity-50"
                : "bg-black/20 hover:bg-[#d8624b]/10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d8624b]/0 via-[#d8624b]/5 to-[#d8624b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className="w-2 h-2 rounded-full bg-[#d8624b] group-hover:animate-pulse" />
              <span className="flex-1 text-sm text-white/90 group-hover:text-white transition-colors">
                Connect Wallet
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d8624b] group-hover:scale-110 transition-transform">
                  +10 XP
                </span>
                {walletAddress && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#d8624b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Connect Twitter Quest */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
              twitterStep === "completed"
                ? "bg-[#d8624b]/5 line-through opacity-50"
                : "bg-black/20 hover:bg-[#d8624b]/10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d8624b]/0 via-[#d8624b]/5 to-[#d8624b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className="w-2 h-2 rounded-full bg-[#d8624b] group-hover:animate-pulse" />
              <span className="flex-1 text-sm text-white/90 group-hover:text-white transition-colors">
                Connect Twitter
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d8624b] group-hover:scale-110 transition-transform">
                  +15 XP
                </span>
                {twitterStep === "completed" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#d8624b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Follow Quest */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
              twitterData.following
                ? "bg-[#d8624b]/5 line-through opacity-50"
                : "bg-black/20 hover:bg-[#d8624b]/10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d8624b]/0 via-[#d8624b]/5 to-[#d8624b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className="w-2 h-2 rounded-full bg-[#d8624b] group-hover:animate-pulse" />
              <span className="flex-1 text-sm text-white/90 group-hover:text-white transition-colors">
                Follow{" "}
                <a
                  href="https://x.com/PlayProvidence"
                  className="text-[#d8624b] hover:text-[#9f7aea] transition-colors inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @PlayProvidence
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d8624b] group-hover:scale-110 transition-transform">
                  +20 XP
                </span>
                {twitterData.following && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#d8624b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Like Quest */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
              isLikeVerified
                ? "bg-[#d8624b]/5 line-through opacity-50"
                : "bg-black/20 hover:bg-[#d8624b]/10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d8624b]/0 via-[#d8624b]/5 to-[#d8624b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className="w-2 h-2 rounded-full bg-[#d8624b] group-hover:animate-pulse" />
              <span className="flex-1 text-sm text-white/90 group-hover:text-white transition-colors">
                Like{" "}
                <a
                  href={`https://x.com/PlayProvidence/status/${LIKE_TWEET_ID}`}
                  className="text-[#d8624b] hover:text-[#9f7aea] transition-colors inline-flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  this tweet
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d8624b] group-hover:scale-110 transition-transform">
                  +30 XP
                </span>
                {isLikeVerified && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#d8624b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Email Quest */}
          <div
            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
              formInputs.email
                ? "bg-[#d8624b]/5 line-through opacity-50"
                : "bg-black/20 hover:bg-[#d8624b]/10"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d8624b]/0 via-[#d8624b]/5 to-[#d8624b]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center gap-4 w-full">
              <div className="w-2 h-2 rounded-full bg-[#d8624b] group-hover:animate-pulse" />
              <span className="flex-1 text-sm text-white/90 group-hover:text-white transition-colors">
                Add Email
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#d8624b] group-hover:scale-110 transition-transform">
                  +25 XP
                </span>
                {formInputs.email && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#d8624b]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Toplam ve mevcut XP hesapla
  const maxXP = steps.reduce((acc, step) => acc + step.xp, 0);
  const currentXP = steps
    .filter((step) => step.isCompleted)
    .reduce((acc, step) => acc + step.xp, 0);

  // Fake follow verification fonksiyonu
  const handleFollowVerification = () => {
    setIsVerifyingFollow(true);
    setTimeout(() => {
      setTwitterData((prev) => ({ ...prev, following: true }));
      setIsVerifyingFollow(false);
    }, 3000);
  };

  // Notification bileşenini güncelle
  const Notification = () => {
    if (!notification?.show) return null;

    const handleDismiss = () => {
      setNotification(null);
    };

    return (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="fixed inset-x-4 top-4 mx-auto max-w-md z-[9999]"
      >
        <div
          className={`w-full px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between gap-3 backdrop-blur-md border ${
            notification.type === "success"
              ? "bg-[#d8624b]/20 border-[#d8624b]/50 text-white"
              : "bg-red-500/20 border-red-500/50 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <div className="w-2 h-2 bg-[#d8624b] rounded-full animate-pulse" />
            ) : (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
            {notification.message}
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 text-xs underline hover:text-white/80 transition-colors shrink-0"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    );
  };

  // renderEmailSection fonksiyonunu tanımla
  const renderEmailSection = () => (
    <div className="space-y-4 p-6 bg-[#0c0c0c] border border-[#7042f88b]/20 rounded-lg">
      {/* Container Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-[#7042f88b]/20">
        <div className="w-2 h-2 bg-[#d8624b]" />
        <h2 className="text-sm font-medium tracking-wider text-white/90 uppercase">
          Email Quest
        </h2>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d8624b]/20 to-transparent" />
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <div className="text-xs text-white/60">
          Enter your email to earn additional XP
        </div>
        <div className="relative">
          <input
            type="email"
            value={formInputs.email}
            onChange={handleInputChange("email")}
            disabled={isSubmitted}
            className={`w-full bg-transparent py-2 sm:py-3 px-4 text-sm sm:text-base font-light tracking-wider focus:outline-none text-white/80 placeholder:text-white/20 border border-[#d8624b]/20 rounded-lg ${
              isSubmitted ? "opacity-50 cursor-not-allowed" : ""
            }`}
            placeholder="Enter your email"
          />
          {isEmailValid && emailMarketingAccepted && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#d8624b]">
              Verified ✓
            </div>
          )}
        </div>
      </div>

      {/* Email Marketing Consent */}
      {isEmailValid && (
        <label className="flex items-start gap-3 p-4 rounded-lg bg-black/20 backdrop-blur-sm cursor-pointer group">
          <input
            type="checkbox"
            checked={emailMarketingAccepted}
            onChange={(e) => setEmailMarketingAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 border-2 border-[#d8624b]/20 rounded-none bg-transparent checked:bg-[#d8624b] appearance-none cursor-pointer transition-all duration-300"
          />
          <div className="space-y-1">
            <div className="text-xs text-white/90">Email Marketing Consent</div>
            <div className="text-[11px] text-white/60 leading-relaxed">
              I agree to receive marketing communications from Providence. You
              can unsubscribe at any time.
            </div>
          </div>
        </label>
      )}
    </div>
  );

  // XP hesaplama fonksiyonu
  const calculateCurrentXP = () => {
    let xp = 0;
    steps.forEach((step) => {
      if (step.isCompleted) {
        xp += step.xp;
      }
    });
    return xp;
  };

  const [canSubmit, setCanSubmit] = useState(false);

  // useEffect ile submit durumunu kontrol et
  useEffect(() => {
    const emailEntered = !!formInputs.email;
    const emailValid = validateEmail(formInputs.email);
    
    setCanSubmit(
      !!walletAddress && 
      disclaimerAccepted && 
      (!emailEntered || (emailValid && emailMarketingAccepted)) // Email girildiyse checkbox da seçili olmalı
    );
  }, [walletAddress, disclaimerAccepted, formInputs.email, emailMarketingAccepted]);

  // Test fonksiyonu ekle
  const testLikes = async () => {
    try {
      console.log("Testing likes with:", {
        user_id: twitterData.user_id,
        access_token: twitterData.access_token?.substring(0, 10) + "..."
      });

      const response = await fetch(
        `http://localhost:3001/twitter/test-likes?user_id=${twitterData.user_id}&access_token=${twitterData.access_token}`
      );
      
      const data = await response.json();
      console.log("Test likes response:", data);

      // Test modal'ı göster
      setTestModal({
        show: true,
        title: "Last 100 Likes Test",
        data: data
      });

    } catch (error) {
      console.error("Test likes failed:", error);
      setNotification({
        show: true,
        message: "Failed to test likes",
        type: "error"
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black/60 via-[#0c0c0c] to-[#0f0514] text-white flex flex-col font-orbitron text-[110%] relative">
      {/* Noise overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05] mix-blend-soft-light">
        <div className="absolute inset-0 bg-noise animate-noise" />
      </div>
      <BackgroundCompiler />
      <ShuffleLoader />
      <DecoElements />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <a
            href="https://playprovidence.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-[0.2em] hover:text-[#7042f88b] transition-all duration-300 group"
          >
            <div className="w-2 h-2 bg-[#d8624b]/30 group-hover:bg-[#d8624b] transition-all duration-300" />
            PLAYPROVIDENCE.IO
          </a>
          <ConnectButton />
        </div>
      </header>
      {/* Main Content */}
      <div className="flex-1 relative">
        <div className="mt-24 sm:mt-32 relative">
          {/* Title */}
          <div className="text-center flex items-center justify-center gap-2 flex-col">
            <p className="text-2xl tracking-[0.2em] text-white uppercase font-medium">
              Do it for Providence
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-[#d8624b]/30 group-hover:bg-[#d8624b] transition-all duration-300" />
              <div className="w-2 h-2 bg-[#d8624b]/30 group-hover:bg-[#d8624b] transition-all duration-300" />
              <div className="w-2 h-2 bg-[#d8624b]/30 group-hover:bg-[#d8624b] transition-all duration-300" />
            </div>
          </div>

          {/* Main Container */}
          <main className="flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 relative">
            {!walletProvider && <DisconnectedMessage />}

            {/* Timer */}
            <div className="mb-5">
              <CountdownTimer targetDate={questEndDate} />
            </div>

            {/* Form Content */}
            <div
              className={`space-y-8 sm:space-y-12 ${
                !walletProvider ? "opacity-30 pointer-events-none" : ""
              }`}
            >
              {/* Wallet Address Display */}
              {walletProvider && walletAddress && (
                <div className="mb-8 sm:mb-3">
                  <div className="bg-[#d8624b]/15 border border-[#d8624b]/20 rounded-lg px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-white/40">
                        Connected Wallet
                      </span>
                      <span className="text-[10px] text-[#d8624b]">
                        Connected ✓
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="font-mono text-sm text-white/70 tracking-wider truncate">
                        {walletAddress}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(walletAddress);
                          setIsCopied(true);
                          setTimeout(() => setIsCopied(false), 2000);
                        }}
                        className="group relative flex items-center"
                      >
                        {isCopied ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-[#d8624b] hover:text-[#9f7aea] transition-colors duration-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        )}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black/80 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {isCopied ? "Copied!" : "Copy"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {renderFormContent()}
              {renderQuests()}
              {renderEmailSection()}

              {/* Required Disclaimer - Box dışında ve hizalı */}
              <label className="flex items-start gap-3 p-4 mt-8 rounded-lg bg-black/20 backdrop-blur-sm cursor-pointer group sticky bottom-0 z-50">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 border-2 border-[#d8624b]/20 rounded-none bg-transparent checked:bg-[#d8624b] appearance-none cursor-pointer transition-all duration-300"
                  required
                />
                <div className="space-y-1">
                  <div className="text-xs text-white/90">
                    Terms & Conditions
                  </div>
                  <div className="text-[11px] text-white/60 leading-relaxed">
                    I acknowledge and agree to Providence's Terms of Service and
                    Privacy Policy. My wallet address and quest activity may be
                    collected.
                  </div>
                </div>
              </label>
            </div>
          </main>
        </div>

        {/* Quest Stepper ve Submit Button Container */}
        <div className="sticky bottom-6 left-0 right-0 z-40 mt-8 sm:mt-12 w-full">
          <div className="px-5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
              {/* Quest Stepper */}
              <div className="w-full md:max-w-[350px]">
                <StepperProgress
                  steps={steps}
                  currentXP={currentXP}
                  maxXP={maxXP}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                {isSubmitted ? (
                  <>
                    <div className="px-6 py-2 bg-[#d8624b]/20 border border-[#d8624b] rounded-lg backdrop-blur-sm">
                      <span className="text-[#d8624b] flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#d8624b] rounded-full animate-pulse" />
                        Completed
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleReset}
                      className="backdrop-blur-sm hover:scale-105 transition-all duration-300"
                    >
                      Start New Quest
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`backdrop-blur-sm transition-all duration-300 flex items-center gap-2
                      ${
                        canSubmit
                          ? "hover:scale-105 animate-pulse-slow"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                  >
                    <span>Submit Quest</span>
                    <span className="text-sm opacity-60">
                      ({calculateCurrentXP()} XP)
                    </span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      <StackedNotifications />
      <Modal
        type="success"
        isOpen={testModal.show}
        onReset={handleReset}
        canClose={true}
        data={testModal.data}
      />
      <AnimatePresence>
        {notification?.show && <Notification />}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
