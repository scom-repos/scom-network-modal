import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export default Styles.style({
  $nest: {
    '::-webkit-scrollbar-track': {
      borderRadius: '12px',
      border: '1px solid transparent',
      backgroundColor: 'unset'
    },
    '::-webkit-scrollbar': {
      width: '8px',
      backgroundColor: 'unset'
    },
    '::-webkit-scrollbar-thumb': {
      borderRadius: '12px',
      background: 'rgba(0, 0, 0, 0.5) 0% 0% no-repeat padding-box'
    }
  }
})

export const modalStyles = Styles.style({
  boxSizing: 'border-box',
  $nest: {
    '.i-modal_header': {
      borderRadius: '10px 10px 0 0',
      background: 'unset',
      borderBottom: `2px solid ${Theme.divider}`,
      padding: '1rem',
      fontWeight: 700,
      fontSize: '1rem'
    },
    '.list-view': {
      $nest: {
        '.list-item': {
          cursor: 'pointer',
          $nest: {
            '&.disabled-network-selection': {
              cursor: 'default',
              $nest: {
                '&:hover > *': {
                  opacity: '0.5 !important',
                }
              }
            },
            '> *': {
              opacity: .5
            }
          }
        },
        '.list-item.is-active': {
          $nest: {
            '> *': {
              opacity: 1
            },
            '&:after': {
              content: "''",
              top: '50%',
              left: 12,
              position: 'absolute',
              background: '#20bf55',
              borderRadius: '50%',
              width: 10,
              height: 10,
              transform: 'translate3d(-50%,-50%,0)'
            }
          }
        }       
      }
    },
    '&> div': {
      transform: 'scale(1)'
    }
  }
})