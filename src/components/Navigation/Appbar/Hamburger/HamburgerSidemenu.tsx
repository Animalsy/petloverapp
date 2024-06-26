import React, { useRef } from "react";
import { StyledMenu } from "./Hamburger.styled";
import useOnClickOutside from "../../../../hooks/clickOutside";
import { HamburgerIcon } from ".";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { NavigationData } from "../../../../static/Navigation";
import { useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
import {
  MdExpandLess,
  MdExpandMore,
  MdOutlineLogin,
  MdOutlineLogout,
} from "react-icons/md";
import { menuCategories } from "../../../../static/menuCategories";
import useJwtHook from "../../../../hooks/jwtHook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { setIsLoggedIn, setIsModalOpen } from "../../../../redux/appsetup";

export const HamburgerSidemenu = ({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const ref = useRef(null);

  useOnClickOutside(ref, () => setOpen(false));

  const navigate = useNavigate();

  const [openSubMenu, setOpenSubMenu] = React.useState("none");
  const handleClick = (data: NavigationData) => {
    setOpenSubMenu(data.name);
    if (openSubMenu === data.name) {
      setOpenSubMenu("none");
    }
    if (!data.nestedNavitems || data.nestedNavitems?.length == 0)
      navigate(data.navigateTo);
  };

  const theme = useTheme();

  const { removeTokenAndUserIdFromStorage } = useJwtHook();

  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.appsetup);

  return (
    <StyledMenu ref={ref} open={isOpen}>
      <HamburgerIcon isOpen={isOpen} setIsOpen={setOpen} />
      <div style={{ height: "100%", margin: "1rem", marginTop: "3rem" }}>
        <List
          sx={{
            width: "100%",
            maxHeight: "80dvh",
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%",
          }}
          component="nav"
        >
          {NavigationData.map((item, index) => {
            return (
              <div key={index + item.name}>
                <ListItemButton onClick={() => handleClick(item)}>
                  {item.icon && (
                    <ListItemIcon>
                      <item.icon
                        color={
                          item.color === "accent"
                            ? theme.colors.accent
                            : theme.colors.primary
                        }
                      />
                    </ListItemIcon>
                  )}
                  <ListItemText
                    primary={item.name}
                    style={{
                      color:
                        item.color === "accent"
                          ? theme.colors.accent
                          : theme.colors.primary,
                    }}
                  />

                  {item.nestedNavitems &&
                    item.nestedNavitems.length !== 0 &&
                    openSubMenu === item.name && (
                      <MdExpandLess
                        color={
                          item.color === "accent"
                            ? theme.colors.accent
                            : theme.colors.primary
                        }
                      />
                    )}
                  {item.nestedNavitems &&
                    item.nestedNavitems.length !== 0 &&
                    openSubMenu !== item.name && (
                      <MdExpandMore
                        color={
                          item.color === "accent"
                            ? theme.colors.accent
                            : theme.colors.primary
                        }
                      />
                    )}
                </ListItemButton>
                {item.nestedNavitems && item.nestedNavitems?.length !== 0 && (
                  <Collapse
                    in={openSubMenu === item.name ? true : false}
                    timeout="auto"
                    unmountOnExit
                  >
                    {menuCategories.map((nestedItem) => {
                      return (
                        <ListItemButton
                          key={nestedItem.category + nestedItem.url}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            navigate(`${item.navigateTo}/${nestedItem.url}`);
                            setOpen(false);
                            setOpenSubMenu("none");
                          }}
                        >
                          <ListItemText primary={nestedItem.category} />
                        </ListItemButton>
                      );
                    })}
                  </Collapse>
                )}
              </div>
            );
          })}
          <div key={"logoutbutton"}>
            <ListItemButton
              onClick={() => {
                if (isLoggedIn) {
                  removeTokenAndUserIdFromStorage();
                  setOpen(false);
                  dispatch(setIsLoggedIn(false));
                } else {
                  setOpen(false);
                  dispatch(setIsLoggedIn(true));
                  dispatch(setIsModalOpen(true));
                }
              }}
            >
              <ListItemIcon>
                {isLoggedIn ? (
                  <MdOutlineLogin color={theme.colors.danger} />
                ) : (
                  <MdOutlineLogout color={theme.colors.danger} />
                )}{" "}
              </ListItemIcon>
              <ListItemText
                primary={!isLoggedIn ? "Login" : "Logout"}
                style={{
                  color: theme.colors.danger,
                }}
              />
            </ListItemButton>
          </div>
        </List>
      </div>
    </StyledMenu>
  );
};
