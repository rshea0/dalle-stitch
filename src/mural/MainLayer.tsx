import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import { clearCanvas, drawImageUrl, useCanvasDraw } from '../canvas';
import { models } from '../store';

export const MainLayer = observer(_MainLayer);

function _MainLayer({ mural, ...passthrough }: { mural: models.Mural }) {
  const { ref } = useCanvasDraw(ctx =>
    autorun(() => {
      clearCanvas(ctx);
      drawMainLayer({ ctx, mural }).catch(console.error);
    }),
  );

  return (
    <canvas
      ref={ref}
      {...passthrough}
    />
  );
}

async function drawMainLayer({
  ctx,
  mural,
}: {
  ctx: CanvasRenderingContext2D;
  mural: models.Mural;
}) {
  await Promise.all(mural.items.map(drawItem));

  async function drawItem(item: models.Mural.Item) {
    switch (item.type) {
      case 'generation':
        await drawGenerationItem(item);
        break;
      case 'image':
        await drawImageItem(item);
        break;
      case 'erase':
        await drawEraseItem(item);
        break;
      default:
        console.error('Mural item not recognized', { item });
    }
  }

  async function drawGenerationItem(item: models.Mural.GenerationItem) {
    await drawImageUrl({
      ctx,
      imageUrl: item.generation.image,
      rect: item,
    });
  }

  async function drawImageItem(item: models.Mural.ImageItem) {
    await drawImageUrl({
      ctx,
      imageUrl: item.image,
      rect: item,
    });
  }

  async function drawEraseItem(item: models.Mural.EraseItem) {}
}
