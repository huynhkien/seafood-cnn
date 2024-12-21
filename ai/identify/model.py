from tensorflow.keras import layers, models


def seafood_model(input_shape, num_classes):
    input_layer = layers.Input(shape=input_shape)

    # Convolutional layers
    x = layers.Conv2D(
    filters=32, 
    kernel_size=3,
    strides=1,
    padding='same',
    activation='relu',
    kernel_initializer='he_normal'
    )(input_layer)

    x = layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2))(x)
    x = layers.Conv2D(
        filters=32, 
        kernel_size=3,
        strides=1,
        padding='same',
        activation='relu',
        kernel_initializer='he_normal'
    )(x)

    x = layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2))(x)
    x = layers.Conv2D(
        filters=64, 
        kernel_size=3,
        strides=1,
        padding='same',
        activation='relu',
        kernel_initializer='he_normal'
    )(x)
    x = layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2))(x)

    x = layers.Conv2D(
        filters=64, 
        kernel_size=3,
        strides=1,
        padding='same',
        activation='relu',
        kernel_initializer='he_normal'
    )(x)
    x = layers.MaxPool2D(pool_size=(2, 2), strides=(2, 2))(x)
    x = layers.Flatten()(x)
    x = layers.Dense(64, activation='relu', kernel_initializer='he_normal')(x)
    x = layers.Dense(32, activation='relu', kernel_initializer='he_normal')(x)
    x = layers.Dropout(0.2)(x)

    name_output = layers.Dense(num_classes, activation='softmax')(x)

    # Create model
    model = models.Model(inputs=input_layer, outputs=name_output)

    return model

