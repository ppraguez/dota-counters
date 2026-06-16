import logoUrl from "../assets/logo.png";

/** Site logo shown in the header. */
export function BrandLogo() {
  return <img className="brand-logo" src={logoUrl} width={46} height={46} alt="Dota 2 Counters & Combos" />;
}
