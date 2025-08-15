<List>
          {topMenu.map((item, index) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => handleClick(index)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {/* Show expand icon only if subItems exist */}
                {item.subItems ? (
                  openIndex === index ? <ExpandLess /> : <ExpandMore />
                ) : null}
              </ListItemButton>
            </ListItem>
                {item.subItems && (
              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItem key={subItem} disablePadding sx={{ pl: 4 }}>
                      <ListItemButton>
                        <ListItemText primary={subItem} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}            
            
          ))}
        </List>