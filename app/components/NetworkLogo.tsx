/**
 * Inline SVG logo components for Ghanaian mobile money networks.
 * Built with react-native-svg — no external image assets needed.
 */
import Svg, {
  Circle,
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import { MobileNetwork } from "../../types/payment";

// ── MTN ────────────────────────────────────────────────────────────────────
// Yellow brand, bold "mtn" wordmark with signature mountain wave
function MtnLogo({ size = 48 }: { size?: number }) {
  const s = size / 48;
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {/* Background */}
      <Rect width="48" height="48" rx="10" fill="#FFCB00" />
      {/* Mountain / wave shape */}
      <Path
        d="M6 34 L14 20 L19 27 L25 16 L33 30 L42 18 L42 38 L6 38 Z"
        fill="#E6B800"
        opacity="0.5"
      />
      {/* "mtn" wordmark */}
      <SvgText
        x="24"
        y="30"
        fontSize="17"
        fontWeight="bold"
        textAnchor="middle"
        fill="#000000"
        fontFamily="Arial Black, Arial, sans-serif"
        letterSpacing="-0.5"
      >
        mtn
      </SvgText>
    </Svg>
  );
}

// ── Telecel ─────────────────────────────────────────────────────────────────
// Red brand (#E40000), white wordmark "telecel"
function TelecelLogo({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id="tcGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FF1A1A" />
          <Stop offset="1" stopColor="#CC0000" />
        </LinearGradient>
      </Defs>
      {/* Background */}
      <Rect width="48" height="48" rx="10" fill="url(#tcGrad)" />
      {/* Signal arc decoration */}
      <Path
        d="M32 8 Q40 16 40 24 Q40 32 32 40"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M35 12 Q42 19 42 24 Q42 30 35 36"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* "telecel" wordmark */}
      <SvgText
        x="22"
        y="28"
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.2"
      >
        telecel
      </SvgText>
    </Svg>
  );
}

// ── AitelTigo ───────────────────────────────────────────────────────────────
// Blue brand (#0057A8), white "AT" monogram with signal wave
function AitelTigoLogo({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <LinearGradient id="atGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#0072C6" />
          <Stop offset="1" stopColor="#004A8C" />
        </LinearGradient>
      </Defs>
      {/* Background */}
      <Rect width="48" height="48" rx="10" fill="url(#atGrad)" />
      {/* Signal wave arcs */}
      <Path
        d="M10 38 Q10 20 24 14"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M6 42 Q6 16 24 8"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* "AT" monogram */}
      <SvgText
        x="28"
        y="32"
        fontSize="22"
        fontWeight="bold"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="Arial Black, Arial, sans-serif"
        letterSpacing="-1"
      >
        AT
      </SvgText>
      {/* small "Money" label */}
      <SvgText
        x="28"
        y="40"
        fontSize="6"
        fontWeight="600"
        textAnchor="middle"
        fill="rgba(255,255,255,0.7)"
        fontFamily="Arial, sans-serif"
        letterSpacing="0.5"
      >
        Money
      </SvgText>
    </Svg>
  );
}

// ── Export map ──────────────────────────────────────────────────────────────
const LOGOS: Record<MobileNetwork, (props: { size?: number }) => JSX.Element> = {
  mtn:     MtnLogo,
  telecel: TelecelLogo,
  aitel:   AitelTigoLogo,
};

export default function NetworkLogo({
  network,
  size = 48,
}: {
  network: MobileNetwork;
  size?: number;
}) {
  const Logo = LOGOS[network];
  return <Logo size={size} />;
}
