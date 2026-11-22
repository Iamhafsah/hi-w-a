
import { useState, useEffect } from 'react'
import { getGuest, getGuestById, submitRSVP } from './services/googleSheets'
import { Routes, Route, useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ArrowDown,
  Check,
  X,
  Download,
  ArrowLeft,
  Ticket
} from "lucide-react";

const wedding = {
  bride: "Hafsah Iheoma",
  groom: "Ibrahim Adeniyi",
  date: "Saturday, 5 December 2026",
  nikah: "11:00 AM - 12:30 PM",
  reception: "2:00 PM",
  venue:
    "Nebo Hall, Ordnance Headquarters, Abalti Barracks, Ojuelegba, Surulere, Lagos",
};


function Home() {
  return (
    <main className="bg-ivory text-emerald-950">
      <section className="hero-section">
        <div className="hero-border">
          <WeddingMonogram />

          <p className="arabic">بسم الله الرحمن الرحيم</p>

          <p className="eyebrow">Together with their families</p>

          <h1 className="couple-names">
            Hafsah
            <span>&</span>
            Ibrahim
          </h1>

          <div className="gold-line" />

          <p className="hero-subtitle">
            Request the pleasure of your company
          </p>

          <p className="event-name">AQDUN NIKAH & WALIMAH</p>

          <p className="hero-date">{wedding.date}</p>

          {/* <div className='max-w-[50%] mx-auto'>
            <Link className="download-button" to='/:token' >
              <Download size={17} />
              Register your attendance
            </Link>
          </div> */}

          <a href="#details" className="explore-link">
            Explore invitation <ArrowDown size={15} />
          </a>
        </div>
      </section>

      <section id="details" className="details-section">
        <p className="eyebrow dark">The celebration</p>
        <h2 className="section-heading">Wedding Details</h2>

        <p className="intro">
          The families of Brig Gen AY Emekoma mni and Late Mr.
          Muyideen Adeniyi Andu cordially invite you to celebrate
          the Aqdun Nikah and Walimah of their beloved children.
        </p>

        <div className="details-grid">
          <Detail
            icon={<CalendarDays />}
            label="Date"
            value={wedding.date}
          />

          <Detail
            icon={<Clock3 />}
            label="Nikah"
            value={wedding.nikah}
          />

          <Detail
            icon={<Clock3 />}
            label="Reception"
            value={wedding.reception}
          />

          <Detail
            icon={<MapPin />}
            label="Venue"
            value={wedding.venue}
          />
        </div>

        <div className="colour-section">
          <p className="eyebrow dark">Colours of the day</p>
          <h3>Emerald Green & Gold</h3>

          <div className="colour-circles">
            <span className="emerald-circle" />
            <span className="gold-circle" />
          </div>
        </div>

        <p className="closing-message">
          We look forward to celebrating with you.
        </p>
      </section>

      <footer>
        HAFSAH & IBRAHIM · 05.12.2026
      </footer>
    </main>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="detail-card">
      <div className="detail-icon">{icon}</div>
      <p className="detail-label">{label}</p>
      <p className="detail-value">{value}</p>
    </div>
  );
}


function GuestInvitation() {
  const { token } = useParams();

  const [guest, setGuest] = useState(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingRSVP, setEditingRSVP] = useState(false);

  // Retrieve the guest's information from Google Sheets
  useEffect(() => {
    let active = true;

    async function loadGuest() {
      try {
        setLoading(true);
        setError("");

        const data = await getGuest(token);

        if (!active) return;

        // Keep the property names expected by AccessCard
        const guestData = {
          ...data,
          name: data.guest_name,
          token: token,
        };

        setGuest(guestData);
        setStatus(data.rsvp_status || "pending");

      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load invitation.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadGuest();

    return () => {
      active = false;
    };
  }, [token]);

  // Submit the guest's RSVP to Google Sheets
  async function handleRSVP(response) {
    if (saving) return;

    try {
      setSaving(true);
      setError("");

      await submitRSVP(token, response);

      setStatus(response);
      setEditingRSVP(false);

    } catch (err) {
      setError(
        err.message || "Your response could not be saved. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="guest-page">
        <div className="guest-card">
          <WeddingMonogram />
          <p className="eyebrow dark">Please wait</p>
          <h2 className="guest-couple">Loading your invitation...</h2>
        </div>
      </main>
    );
  }

  if (!guest) {
    return (
      <Message
        title="Invitation not found"
        text={error || "This invitation link is invalid or unavailable."}
      />
    );
  }

 if (status === "accepted" && !editingRSVP) {
  return (
    <AccessCard
      guest={guest}
      onChangeRSVP={() => setEditingRSVP(true)}
    />
  );
}

  return (
    <main className="guest-page">
      <div className="guest-card">
        <div className="mt-2">
          <WeddingMonogram />
        </div>

        <p className="eyebrow dark">A personal invitation for</p>

        <h1 className="guest-name">{guest.name}</h1>

        <p className="guest-description">
          You are cordially invited to celebrate the Aqdun
          Nikah and Walimah of
        </p>

        <h2 className="guest-couple">
          Hafsah <span>&</span> Ibrahim
        </h2>

        <p className="guest-date">{wedding.date}</p>

        <div className="guest-divider" />

        {status === "declined" && (
          <p className="guest-question ">
            You previously declined this invitation.
            You can still change your response.
          </p>
        )}

        {status === "accepted" && editingRSVP && (
          <p className="guest-question ">
            You previously accepted this invitation.
            Would you like to change your response?
          </p>
        )}

        {status === "pending" && (
          <p className="guest-question">
            Will you be attending?
          </p>
        )}

        <div className="gap-[12px] flex flex-col md:flex-row w-full justify-center items-center ">
          <button
            className="accept-button"
            onClick={() => handleRSVP("accepted")}
            disabled={saving}
          >
            <Check size={17} />
            {saving ? "Saving..." : "Accept invitation"}
          </button>

          <button
            className="decline-button"
            onClick={() => handleRSVP("declined")}
            disabled={saving}
          >
            <X size={17} />
            {saving ? "Saving..." : "Decline invitation"}
          </button>
        </div>

        {error && (
          <p className="rsvp-error" role="alert">
            {error}
          </p>
        )}

        <Link to="/" className="back-link">
          View wedding details
        </Link>
      </div>
    </main>
  );
}


function GuestVerification() {
  const { guestId } = useParams();

  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadGuest() {
      try {
        const data = await getGuestById(guestId);
        setGuest(data);
      } catch (err) {
        setError(err.message || "Unable to verify this guest.");
      } finally {
        setLoading(false);
      }
    }

    loadGuest();
  }, [guestId]);

  if (loading) {
    return (
      <main className="guest-verification-page">
        <div className="verification-card">
          <WeddingMonogram />
          <p>Verifying guest information...</p>
        </div>
      </main>
    );
  }

  if (error || !guest) {
    return (
      <main className="guest-verification-page">
        <div className="verification-card">
          <WeddingMonogram />
          <h2>Guest Not Found</h2>
          <p>{error || "This guest ID could not be verified."}</p>
        </div>
      </main>
    );
  }

  const checkedIn = guest.checkin_status === "checked_in";

  return (
    <main className="guest-verification-page">
      <div className="verification-card">
        <WeddingMonogram />

        <p className="verification-eyebrow">
          HAFSAH & IBRAHIM
        </p>

        <h1>Guest Verification</h1>

        <div className="verification-divider" />

        <p className="verification-label">GUEST NAME</p>
        <h2>{guest.guest_name}</h2>

        <p className="verification-label">UNIQUE GUEST ID</p>
        <p className="verification-id">{guest.guest_id}</p>

        <div className={`verification-status ${checkedIn ? "checked-in" : ""}`}>
          <p>CHECK-IN STATUS</p>
          <strong>
            {checkedIn ? "ALREADY CHECKED IN" : "NOT YET CHECKED IN"}
          </strong>
        </div>

        <div className="verification-wedding-details">
          <p>{wedding.date}</p>
          <p>11:00 AM · NIKAH</p>
          <p>2:00 PM · RECEPTION</p>
          <p>NEBO HALL · LAGOS</p>
        </div>
      </div>
    </main>
  );
}

function AccessCard({ guest, onChangeRSVP }) {
  const hasBeenScanned = guest.checkin_status === "checked_in";

  const checkInStatus = hasBeenScanned
    ? "ALREADY CHECKED IN"
    : "NOT YET CHECKED IN";

  const qrValue = `${import.meta.env.VITE_GUEST_PAGE_URL}/${encodeURIComponent(
  guest.guest_id
  )}`;

  function downloadCard() {
    const svg = document.getElementById("guest-qr");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 900;
      canvas.height = 1200;

      const context = canvas.getContext("2d");

      // Emerald background
      context.fillStyle = "#0d3028";
      context.fillRect(0, 0, 900, 1200);

      // Decorative gold pattern
      context.strokeStyle = "rgba(215,189,131,0.16)";
      context.lineWidth = 1;

      for (let x = 0; x < 900; x += 45) {
        for (let y = 0; y < 1200; y += 45) {
          context.beginPath();
          context.moveTo(x, y + 22);
          context.lineTo(x + 22, y);
          context.lineTo(x + 45, y + 22);
          context.lineTo(x + 22, y + 45);
          context.closePath();
          context.stroke();
        }
      }

      // Double gold frame
      context.strokeStyle = "#d7bd83";
      context.lineWidth = 3;
      context.strokeRect(35, 35, 830, 1130);

      context.lineWidth = 1;
      context.strokeRect(50, 50, 800, 1100);

      context.textAlign = "center";

      context.fillStyle = "#d7bd83";
      context.font = "24px Georgia";
      context.fillText("♡  HAFSAH & IBRAHIM  ♡", 450, 125);

      context.fillStyle = "#f8f5ed";
      context.font = "56px Georgia";
      context.fillText("Wedding Access Pass", 450, 235);

      context.fillStyle = "#d7bd83";
      context.font = "24px Arial";
      context.fillText("A Q D U N  N I K A H  &  W A L I M A H", 450, 295);

      context.beginPath();
      context.moveTo(330, 335);
      context.lineTo(570, 335);
      context.strokeStyle = "#d7bd83";
      context.lineWidth = 2;
      context.stroke();

      context.fillStyle = "#d7bd83";
      context.font = "20px Arial";
      context.fillText("THIS PASS BELONGS TO", 450, 395);

      context.fillStyle = "#ffffff";
      context.font = "48px Georgia";
      context.fillText(guest.name, 450, 475);

      // White QR panel
      context.fillStyle = "#ffffff";
      context.fillRect(275, 520, 350, 350);
      context.drawImage(image, 295, 540, 310, 310);

      context.fillStyle = "#f8f5ed";
      context.font = "25px Arial";
      context.fillText("SATURDAY, 5 DECEMBER 2026", 450, 950);

      context.font = "20px Arial";
      context.fillText("NEBO HALL · LAGOS", 450, 1000);


      canvas.toBlob((blob) => {
        if (!blob) return;

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = "wedding-access-card.png";
        link.click();

        URL.revokeObjectURL(downloadUrl);
      });

      URL.revokeObjectURL(url);
    };

    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }

  return (
    <main className="access-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
    
    <div className="floating-star star-one">♡</div>
<div className="floating-star star-two">♡</div>


      <div className="access-container access-reveal">
        <WeddingMonogram />

        <div className="success-message">
          <span className="success-icon"><Check size={16} /></span>
          Invitation accepted
        </div>

        <p className="eyebrow dark">Your personal access card</p>
        <h2 className="access-heading">You're on the guest list.</h2>
        <p className="access-intro">
          Your invitation is ready. Keep this pass safe for your arrival.
        </p>

        <div className="access-card">
          <div className="access-card-pattern" />
          <div className="access-card-inner">
            <p className="access-brand">HAFSAH & IBRAHIM</p>
            <p className="access-subbrand">CORDIALLY INVITE YOU</p>

            <h2>Wedding Access Pass</h2>
            <p className="admit-one">♡ &nbsp; ADMITS ONE &nbsp; ♡</p>

            <div className="access-divider">
              <span>♡</span>
            </div>

            <p className="access-guest-label">THIS PASS BELONGS TO</p>
            <h2>{guest.name}</h2>

            <p className="access-date">{wedding.date}</p>

            <div className="qr-container">
              <QRCodeSVG
                id="guest-qr"
                value={qrValue}
                size={190}
                level="H"
                bgColor="#ffffff"
                fgColor="#123c32"
              />
            </div>

            <p className="qr-instruction">
              Present this QR code at the entrance
            </p>

            <div className="access-event-details">
              <span>11:00 AM · NIKAH</span>
              <span>2:00 PM · RECEPTION</span>
            </div>

            <div className="access-footer">
              <p>NEBO HALL · LAGOS</p>
              <p>ONE GUEST</p>
            </div>
            {/* <div className="access-bottom-ornament">❧</div> */}
          </div>
        </div>

        <div className="w-full flex flex-col items-center">
          <button className="download-button" onClick={downloadCard}>
          <Download size={17} />
          Download your access card
        </button>

        <button
          className="back-link"
          onClick={onChangeRSVP}
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          Change your RSVP response
        </button>
        </div>

        <p className="access-note">
          Keep this card safe and present it when you arrive.
        </p>

        <Link to="/" className="back-link">
          <ArrowLeft size={15} />
          Back to wedding website
        </Link>
      </div>
    </main>
  );
}



function Message({ title, text }) {
  return (
    <main className="guest-page">
      <div className="guest-card">
        <h1 className="guest-name">{title}</h1>
        <p className="guest-description">{text}</p>
        <Link to="/" className="back-link">
          Return to invitation
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:token" element={<GuestInvitation />} />
      <Route path="/guest/:guestId" element={<GuestVerification />} />
    </Routes>
  );
}

function WeddingMonogram() {
  return (
    <div className="hi-monogram">
      <span>H&I</span>
    </div>
  );
}
