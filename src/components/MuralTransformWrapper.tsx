import { chakra } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

// export const MuralTransformContext = createContext<Transform

export const MuralTransformWrapper = chakra(_MuralTransformWrapper);

export function _MuralTransformWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <TransformWrapper
      minScale={0.25}
      initialScale={0.5}
      centerOnInit={true}
      limitToBounds={false}
      panning={{ velocityDisabled: true }}
      doubleClick={{ mode: 'reset' }}
    >
      {() => (
        <TransformComponent
          contentStyle={{
            display: 'flex',
            flexDirection: 'row',
          }}
          wrapperStyle={{
            width: '100%',
            height: '100%',
          }}
          wrapperClass={className}
        >
          {children}
        </TransformComponent>
      )}
    </TransformWrapper>
  );
}
