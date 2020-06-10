function SimpleFactory(i) {
    return {i};
}

function FunctionFactory(i) {
    this.i = i;
}

class ClassFactory {
    constructor(i) {
        this.i = i;
    }
}

function FreezeFactory(i) {
    return Object.freeze({i});
}

function FreezeFunctionFactory(i) {
    this.i = i;
    Object.freeze(this);
}

class FreezeClassFactory {
    constructor(i) {
        this.i = i;
        Object.freeze(this);
    }
}

class ClassFactoryExtendFreeze extends ClassFactory {
    constructor(i) {
        super(i);
        Object.freeze(this);
    }
}



describe("Object Factory", function () {
    /** @var {Array<number>[]} numbers */
    const dataSet = Object.freeze(Array(1000).fill(undefined).map(
        () => Object.freeze(Array(1000).fill(undefined).map((_, i) => (Math.random() * 10000).toFixed())),
    ));

    [
        ['Create', [
            SimpleFactory,
            FunctionFactory,
            ClassFactory,
        ]],
        ['Create & Freeze', [
            FreezeFactory,
            FreezeFunctionFactory,
            FreezeClassFactory,
            ClassFactoryExtendFreeze,
        ]]
    ].forEach(([title, factories]) => {
        describe(title, () => {
            factories.forEach((factory) => {
                it(
                    factory.name,
                    function () {
                        this.test.body  = "\n" + factory.toString();
                        const result = dataSet.every(
                            (numbers) => numbers
                                .every((i) => (new factory(i)).i === i )
                        );
                        expect(result).to.be.true;
                    }
                )
            })
        })
    })
});
