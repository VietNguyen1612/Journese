import {
  faAddressCard,
  faBell,
  faFileLines,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBug,
  faCalculator,
  faChartPie,
  faCode,
  faDroplet,
  faGauge,
  faLayerGroup,
  faLocationArrow,
  faPencil,
  faPuzzlePiece,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import React, { PropsWithChildren } from "react";
import { Badge } from "react-bootstrap";
import SidebarNavGroup from "@/app/ui/dashboard/Sidebar/SidebarNavGroup";
import SidebarNavItem from "@/app/ui/dashboard/Sidebar/SidebarNavItem";

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props;

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">
      {children}
    </li>
  );
};

export default function SidebarNav() {
  return (
    <ul className="list-unstyled">
      {/* <SidebarNavItem icon={faGauge} href="/">
        Dashboard
        <small className="ms-auto">
          <Badge bg="info" className="ms-auto">
            NEW
          </Badge>
        </small>
      </SidebarNavItem> */}
      {/* <SidebarNavItem icon={faCode} href="/pokemons">
        Sample
        <small className="ms-auto">
          <Badge bg="danger" className="ms-auto">
            DEMO
          </Badge>
        </small>
      </SidebarNavItem> */}
      <SidebarNavTitle>User</SidebarNavTitle>
      <SidebarNavItem icon={faDroplet} href="/users">
        All user
      </SidebarNavItem>
      <SidebarNavItem icon={faPencil} href="/confirm">
        Confirmation
      </SidebarNavItem>
      <SidebarNavTitle>Reports</SidebarNavTitle>
      <SidebarNavItem icon={faPencil} href="/reports">
        User Reports
      </SidebarNavItem>
      <SidebarNavItem icon={faPencil} href="/reports/post">
        Post Reports
      </SidebarNavItem>
      <SidebarNavTitle>Places</SidebarNavTitle>
      <SidebarNavItem icon={faPencil} href="/places">
        All places
      </SidebarNavItem>
      <SidebarNavTitle>Advertisements</SidebarNavTitle>
      <SidebarNavItem icon={faDroplet} href="/ads">
        Valid ads
      </SidebarNavItem>
      <SidebarNavItem icon={faDroplet} href="/ads/invalid">
        Pending ads
      </SidebarNavItem>
      {/* <SidebarNavGroup toggleIcon={faStar} toggleText="Pages">
        <SidebarNavItem icon={faRightToBracket} href="login">
          Login
        </SidebarNavItem>
        <SidebarNavItem icon={faAddressCard} href="register">
          Register
        </SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">
          Error 404
        </SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">
          Error 500
        </SidebarNavItem>
      </SidebarNavGroup> */}
    </ul>
  );
}
