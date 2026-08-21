package com.shope.kf.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.media.IntegerSchema;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.parameters.Parameter;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SwaggerExampleCustomizerTest {
    private final SwaggerExampleCustomizer customizer = new SwaggerExampleCustomizer();

    @Test
    void addsUsefulExamplesAndMarksAuditFieldsReadOnly() {
        ObjectSchema request = new ObjectSchema();
        request.addProperty("username", new StringSchema());
        request.addProperty("productId", new IntegerSchema().format("int64"));
        request.addProperty("createdAt", new StringSchema().format("date-time"));
        OpenAPI openApi = new OpenAPI().components(new Components().addSchemas("DemoRequest", request));

        customizer.customise(openApi);

        assertThat(request.getProperties().get("username").getExample()).isEqualTo("admin");
        assertThat(request.getProperties().get("productId").getExample()).isEqualTo(1);
        assertThat(request.getProperties().get("createdAt").getReadOnly()).isTrue();
    }

    @Test
    void leavesOptionalFiltersBlankAndAddsRequiredParameterExamples() {
        Parameter search = new Parameter().name("search").in("query").example("dress").schema(new StringSchema());
        Parameter page = new Parameter().name("page").in("query")
                .example(999).schema(new IntegerSchema()._default(0));
        Parameter size = new Parameter().name("size").in("query")
                .example("M").schema(new IntegerSchema()._default(10));
        Parameter sort = new Parameter().name("sort").in("query")
                .example("id,desc").schema(new StringSchema()._default("deletedAt,desc"));
        Parameter id = new Parameter().name("id").in("path").required(true).schema(new StringSchema());
        Operation operation = new Operation()
                .addParametersItem(search)
                .addParametersItem(page)
                .addParametersItem(size)
                .addParametersItem(sort)
                .addParametersItem(id);
        OpenAPI openApi = new OpenAPI().paths(
                new Paths().addPathItem("/api/products", new PathItem().get(operation))
        );

        customizer.customise(openApi);

        assertThat(search.getExample()).isNull();
        assertThat(page.getExample()).isEqualTo(0);
        assertThat(size.getExample()).isEqualTo(10);
        assertThat(sort.getExample()).isEqualTo("deletedAt,desc");
        assertThat(id.getExample()).isEqualTo("sample-id");
    }
}
