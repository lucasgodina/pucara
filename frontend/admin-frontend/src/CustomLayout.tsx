import React from 'react'
import { Layout, Sidebar } from 'react-admin'
import { styled } from '@mui/material/styles'

// Sidebar personalizado con estilos mejorados para el estado minimizado
const StyledSidebar = styled(Sidebar)(({ theme }) => ({
  '& .RaSidebar-drawerPaper': {
    'transition': 'width 0.2s ease-in-out',
    'overflow': 'hidden',

    // Estilos para el estado expandido
    '& .RaMenu-root': {
      marginTop: 0,
      paddingTop: theme.spacing(1),
    },

    '& .RaMenuItemLink-root': {
      'paddingLeft': theme.spacing(2),
      'paddingRight': theme.spacing(2),
      'minHeight': '48px',
      'display': 'flex',
      'alignItems': 'center',
      'margin': `${theme.spacing(0.5)} ${theme.spacing(1)}`,
      'borderRadius': theme.shape.borderRadius,

      '& .RaMenuItemLink-icon': {
        minWidth: '40px',
        marginRight: theme.spacing(1.5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
      },

      '& .RaMenuItemLink-primary': {
        opacity: 1,
        transition: 'opacity 0.2s ease-in-out',
        whiteSpace: 'nowrap',
      },

      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },

      '&.RaMenuItemLink-active': {
        'backgroundColor': theme.palette.primary.main,
        'color': theme.palette.primary.contrastText,
        'paddingLeft': theme.spacing(2), // Forzar el mismo padding que el estado normal
        'paddingRight': theme.spacing(2), // Forzar el mismo padding que el estado normal
        'margin': `${theme.spacing(0.5)} ${theme.spacing(1)}`, // Forzar el mismo margin
        'transform': 'none', // Eliminar cualquier transformación
        'boxShadow': 'none', // Eliminar sombra que podría afectar posición

        '& .RaMenuItemLink-icon': {
          minWidth: '40px',
          marginRight: theme.spacing(1.5),
          transform: 'none', // Eliminar transformación del ícono
        },

        '& .RaMenuItemLink-primary': {
          transform: 'none', // Eliminar transformación del texto
        },

        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    },
  },

  // Estilos para cuando el sidebar está cerrado/minimizado
  '& .RaSidebar-drawerPaper.RaSidebar-drawerPaperClose': {
    '& .RaMenuItemLink-root': {
      'paddingLeft': theme.spacing(1),
      'paddingRight': theme.spacing(1),
      'justifyContent': 'center',
      'margin': `${theme.spacing(0.5)} ${theme.spacing(0.5)}`,

      '& .RaMenuItemLink-icon': {
        'minWidth': 'auto',
        'marginRight': 0,
        'width': '24px',
        'height': '24px',
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        '& svg': {
          width: '20px',
          height: '20px',
        },
      },

      '& .RaMenuItemLink-primary': {
        opacity: 0,
        width: 0,
        overflow: 'hidden',
      },
    },
  },
}))

export const CustomLayout = (props: any) => (
  <Layout
    {...props}
    sidebar={StyledSidebar}
    sx={{
      '& .RaLayout-content': {
        transition: 'margin-left 0.2s ease-in-out',
      },
    }}
  />
)
