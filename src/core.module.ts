import {CoverModule} from "./modules/cover/cover.module";
import {FormatModule} from "./modules/format/format.module";
import {forwardRef, Global, Module} from "@nestjs/common";
import {AuthorModule} from "./modules/author/author.module";
import {BookModule} from "./modules/book/book.module";
import {PublishingModule} from "./modules/publishing/publishing.module";

@Global()
@Module({
    imports: [
        forwardRef(() => AuthorModule),
        forwardRef(() => BookModule),
        forwardRef(() => CoverModule),
        forwardRef(() => FormatModule),
        forwardRef(() => PublishingModule),
    ],
    exports: [
        AuthorModule,
        BookModule,
        CoverModule,
        FormatModule,
        PublishingModule,
    ],
})
export class CoreModule {}
