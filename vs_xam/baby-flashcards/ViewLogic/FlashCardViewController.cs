﻿using System;
using UIKit;
using CoreGraphics;
using AVFoundation;
using Foundation;

namespace babyflashcards
{

	public class FlashCardViewController : UIViewController
	{
		private readonly FlashCard _flashCard;
		private UIImageView _imageView;
		private UIButton _cancelButton;
		AVAudioPlayer _itemSound;
		IApplicationEventHandler _eventHandler;
		private CGRect _sourceFrame;

		public FlashCardViewController (FlashCard flashCard, CGRect sourceFrame, IApplicationEventHandler eventHandler)
		{
			_flashCard = flashCard;
			_eventHandler = eventHandler;
			_sourceFrame = sourceFrame;
		}

		public CGRect SourceFrame{
			get {
				return _sourceFrame;	
			}
		}

		public override void ViewDidLoad ()
		{
			base.ViewDidLoad ();
			_imageView = new UIImageView (View.Bounds); //UIButton.FromType(UIButtonType.Custom);
			//_imageView.ContentMode = UIViewContentMode.ScaleAspectFill;
			//_imageView.Frame = View.Bounds;
			//_imageView.ClipsToBounds = true;
			//_imageView.Layer.MasksToBounds = true;
			//_imageView.Center = View.Center;
			var orientation = UIDevice.CurrentDevice.Orientation;
            FlashCardImageCrop crop;
            string xCassetName;
            if (orientation == UIDeviceOrientation.Portrait)
            {
                crop = _flashCard.ImageDef[AspectRatio.Twelve16].Portrait.Crop;
                xCassetName = _flashCard.ImageDef[AspectRatio.Twelve16].Portrait.XCasset;
            } else
            {
                crop = _flashCard.ImageDef[AspectRatio.Twelve16].Landscape.Crop;
                xCassetName = _flashCard.ImageDef[AspectRatio.Twelve16].Landscape.XCasset;
            }
			_imageView.Layer.ContentsRect = new CGRect { X = crop.X1, Y = crop.Y1, Width = crop.Width, Height = crop.Height  };
			_imageView.Image = UIImage.FromBundle (xCassetName);
			//_imageView.SetImage(UIImage.FromBundle(_flashCard.Image), UIControlState.Normal);


			_cancelButton = UIButton.FromType(UIButtonType.Custom);
			_cancelButton.Frame = View.Bounds;
			_cancelButton.TouchUpInside += (object sender, EventArgs e) => {
				if(_eventHandler != null){
					_eventHandler.FlashCardDismissed();
					_itemSound.Stop();
				}

			};

			View.AddSubview (_imageView);
			View.AddSubview (_cancelButton);


			var songURL = new NSUrl ("sounds/" + _flashCard.Sound);
			NSError err;
			_itemSound = new AVAudioPlayer(songURL, AVFileType.MpegLayer3, out err);
			_itemSound.Volume = 7;
			//			_itemSound.FinishedPlaying += delegate { 
			//				// backgroundMusic.Dispose(); 
			//				_itemSound = null;
			//			};
			_itemSound.NumberOfLoops=0;
			_itemSound.Play();
			//backgroundSong=filename;
		}

		public override void ViewDidAppear (bool animated)
		{
			//_imageView.SetImage(UIImage.FromBundle(_picPath), UIControlState.Normal);
			_itemSound.Play ();
		}

	}
}
